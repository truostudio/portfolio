#!/usr/bin/env node
/**
 * Capture a WebP poster (near-first frame) for each used MP4 in public/.
 * Uses Playwright's Chromium + canvas with CORS-enabled local static server.
 * Run: node scripts/extract-video-posters.mjs
 */
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { chromium } from 'playwright'

const ROOT = path.resolve(import.meta.dirname, '..', 'public')
const OUT_DIR = path.join(ROOT, 'posters')

const USED = [
  'Japanese-greeting.mp4',
  'Maki Landing PoC.mp4',
  'action-bar.mp4',
  'ai-assistant.mp4',
  'anime-editor.mp4',
  'anime-player.mp4',
  'api-list.mp4',
  'beforedocsux.mp4',
  'component-library.mp4',
  'flow.mp4',
  'generating.mp4',
  'maki-action-bar.mp4',
  'maki-agent.mp4',
  'maki-character-generation.mp4',
  'maki-home.mp4',
  'maki-store1.mp4',
  'maki-store2.mp4',
  'new-site.mp4',
  'newdocsux.mp4',
  'old-site.mp4',
  'pricing.mp4',
  'search.mp4',
]

function contentType(filePath) {
  if (filePath.endsWith('.mp4')) return 'video/mp4'
  return 'application/octet-stream'
}

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const urlPath = decodeURIComponent((req.url || '/').split('?')[0])
      const filePath = path.join(ROOT, urlPath.replace(/^\//, ''))
      if (!filePath.startsWith(ROOT) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        res.writeHead(404, { 'Access-Control-Allow-Origin': '*' })
        res.end('not found')
        return
      }
      const stat = fs.statSync(filePath)
      res.writeHead(200, {
        'Content-Type': contentType(filePath),
        'Content-Length': stat.size,
        'Access-Control-Allow-Origin': '*',
        'Accept-Ranges': 'bytes',
      })
      fs.createReadStream(filePath).pipe(res)
    })
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address()
      resolve({ server, port })
    })
  })
}

fs.mkdirSync(OUT_DIR, { recursive: true })

const { server, port } = await startServer()
const browser = await chromium.launch()
const page = await browser.newPage()

let ok = 0
let failed = 0

for (const name of USED) {
  const srcPath = path.join(ROOT, name)
  if (!fs.existsSync(srcPath)) {
    console.log(`skip   ${name} (missing)`)
    continue
  }

  const safeUrl = `http://127.0.0.1:${port}/${name.split('/').map(encodeURIComponent).join('/')}`

  try {
    const dataUrl = await page.evaluate(async (src) => {
      const video = document.createElement('video')
      video.crossOrigin = 'anonymous'
      video.muted = true
      video.playsInline = true
      video.preload = 'auto'
      video.src = src
      document.body.replaceChildren(video)

      await new Promise((resolve, reject) => {
        const t = setTimeout(() => reject(new Error('timeout loading video')), 90000)
        video.addEventListener('loadeddata', () => {
          clearTimeout(t)
          resolve()
        }, { once: true })
        video.addEventListener('error', () => {
          clearTimeout(t)
          reject(new Error('video error'))
        }, { once: true })
      })

      try {
        video.currentTime = Math.min(0.12, (video.duration || 1) * 0.02)
        await new Promise((resolve) => {
          video.addEventListener('seeked', resolve, { once: true })
        })
      } catch {
        // keep frame 0
      }

      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth || 1280
      canvas.height = video.videoHeight || 720
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
      return canvas.toDataURL('image/webp', 0.84)
    }, safeUrl)

    const base64 = dataUrl.split(',')[1]
    if (!base64) throw new Error('empty data url')
    const outName = name.replace(/\.mp4$/i, '.webp')
    const outPath = path.join(OUT_DIR, outName)
    fs.writeFileSync(outPath, Buffer.from(base64, 'base64'))
    const kb = (fs.statSync(outPath).size / 1024).toFixed(0)
    console.log(`ok     ${outName} (${kb}KB)`)
    ok++
  } catch (err) {
    failed++
    console.error(`fail   ${name}: ${err.message}`)
  }
}

await browser.close()
server.close()
console.log(`\nDone. ok=${ok} failed=${failed}`)
if (failed) process.exitCode = 1
