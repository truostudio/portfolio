import { chromium } from 'playwright'
import { existsSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = resolve(__dirname, '../public')

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true })

const VIEWPORT = { width: 1440, height: 900 }
const SETTLE_MS = 4000  // wait after load before recording
const RECORD_MS = 6000  // how long to record

async function record(url, outPath) {
  console.log(`Recording ${url} → ${outPath}`)
  const browser = await chromium.launch({
    args: ['--disable-blink-features=AutomationControlled'],
  })
  const ctx = await browser.newContext({
    viewport: VIEWPORT,
    recordVideo: { dir: OUT_DIR, size: VIEWPORT },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  })
  const page = await ctx.newPage()

  await page.emulateMedia({ reducedMotion: 'no-preference' })

  try {
    await page.goto(url, { waitUntil: 'load', timeout: 30000 })
  } catch {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })
  }

  // Hide Wayback Machine toolbar if present
  await page.addStyleTag({ content: `
    #wm-ipp-base, #wm-ipp, .wb-autocomplete-suggestions,
    #donato, #wm-tb { display: none !important; }
  ` })

  // Scroll to top of actual page content
  await page.evaluate(() => window.scrollTo(0, 0))

  // Simulate mouse movement to trigger hover animations
  await page.mouse.move(720, 400)

  // Let JS hydrate
  await page.waitForTimeout(SETTLE_MS)

  // Gentle scroll to trigger intersection observers, then back up
  await page.evaluate(() => window.scrollTo({ top: 300, behavior: 'smooth' }))
  await page.waitForTimeout(800)
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }))

  console.log(`  Settled, recording for ${RECORD_MS}ms...`)
  await page.waitForTimeout(RECORD_MS)

  const video = page.video()
  await ctx.close()
  await browser.close()

  const tmpPath = await video.path()
  const { rename } = await import('fs/promises')
  await rename(tmpPath, outPath)
  console.log(`  Saved: ${outPath}`)
}

// Try a few Wayback Machine snapshots for the old site
const OLD_URLS = [
  'https://web.archive.org/web/20231101120000/https://uniblock.dev/',
  'https://web.archive.org/web/20231001120000/https://uniblock.dev/',
  'https://web.archive.org/web/20230801120000/https://uniblock.dev/',
]

await record('https://uniblock.dev', resolve(OUT_DIR, 'new-site.webm'))

let recorded = false
for (const url of OLD_URLS) {
  try {
    await record(url, resolve(OUT_DIR, 'old-site.webm'))
    recorded = true
    break
  } catch (e) {
    console.log(`  Failed: ${url} — ${e.message}`)
  }
}
if (!recorded) console.warn('Could not record old site from any Wayback Machine snapshot.')
