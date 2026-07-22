#!/usr/bin/env node
/**
 * Re-encode home-grid MP4s for the web (small cards).
 * Case-study videos are left at original size/quality on purpose.
 *
 * Run: node scripts/compress-videos.mjs
 *      node scripts/compress-videos.mjs --only=search.mp4,flow.mp4
 */
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import ffmpegPath from 'ffmpeg-static'
import ffprobe from 'ffprobe-static'

const ROOT = path.resolve(import.meta.dirname, '..', 'public')

const HOME = new Set([
  'search.mp4',
  'generating.mp4',
  'flow.mp4',
  'action-bar.mp4',
  'Japanese-greeting.mp4',
])

const SETTINGS = { maxWidth: 960, crf: 28, maxrate: '900k', bufsize: '1800k' }

const onlyArg = process.argv.find((a) => a.startsWith('--only='))?.split('=')[1]
const only = onlyArg ? new Set(onlyArg.split(',').map((s) => s.trim()).filter(Boolean)) : null

function probe(file) {
  const result = spawnSync(ffprobe.path, [
    '-v', 'quiet',
    '-print_format', 'json',
    '-show_streams',
    '-show_format',
    file,
  ], { encoding: 'utf8' })
  if (result.status !== 0) throw new Error(result.stderr || 'ffprobe failed')
  return JSON.parse(result.stdout)
}

function compress(input, output) {
  const result = spawnSync(ffmpegPath, [
    '-y',
    '-i', input,
    '-vf', `scale='min(${SETTINGS.maxWidth},iw)':-2:flags=lanczos`,
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-profile:v', 'high',
    '-level', '4.1',
    '-preset', 'medium',
    '-crf', String(SETTINGS.crf),
    '-maxrate', SETTINGS.maxrate,
    '-bufsize', SETTINGS.bufsize,
    '-movflags', '+faststart',
    '-an',
    output,
  ], { encoding: 'utf8' })
  if (result.status !== 0) {
    throw new Error(result.stderr?.slice(-800) || 'ffmpeg failed')
  }
}

const files = fs.readdirSync(ROOT).filter((f) => f.endsWith('.mp4')).sort()
let saved = 0
let beforeTotal = 0
let afterTotal = 0

for (const name of files) {
  if (only ? !only.has(name) : !HOME.has(name)) {
    if (!only) console.log(`skip   ${name}`)
    continue
  }

  const input = path.join(ROOT, name)
  const before = fs.statSync(input).size
  beforeTotal += before

  const info = probe(input)
  const video = info.streams.find((s) => s.codec_type === 'video')
  const w = video?.width || '?'
  const h = video?.height || '?'
  const dur = Number(info.format.duration || 0)

  const tmp = path.join(ROOT, `.${name}.tmp.mp4`)
  try {
    compress(input, tmp)
    const after = fs.statSync(tmp).size
    if (after >= before * 0.98) {
      fs.unlinkSync(tmp)
      afterTotal += before
      console.log(`keep   ${name} (${(before / 1e6).toFixed(1)}MB ${w}x${h} ${dur.toFixed(1)}s)`)
      continue
    }
    fs.renameSync(tmp, input)
    afterTotal += after
    saved += before - after
    const pct = ((1 - after / before) * 100).toFixed(0)
    console.log(
      `ok     ${name}  ${(before / 1e6).toFixed(1)}→${(after / 1e6).toFixed(1)}MB (-${pct}%)  ${w}x${h} ${dur.toFixed(1)}s`,
    )
  } catch (err) {
    if (fs.existsSync(tmp)) fs.unlinkSync(tmp)
    afterTotal += before
    console.error(`fail   ${name}: ${err.message}`)
  }
}

console.log(
  `\nDone. ${(beforeTotal / 1e6).toFixed(1)}MB → ${(afterTotal / 1e6).toFixed(1)}MB (saved ${(saved / 1e6).toFixed(1)}MB)`,
)
