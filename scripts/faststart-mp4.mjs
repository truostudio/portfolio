#!/usr/bin/env node
/**
 * Relocate the moov atom before mdat (qt-faststart) without re-encoding.
 * Browsers need moov early to paint the first frame; otherwise they often
 * download nearly the whole file first → long black/blank boxes.
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..', 'public')

function readU32(buf, off) {
  return buf.readUInt32BE(off)
}

function writeU32(buf, off, value) {
  buf.writeUInt32BE(value >>> 0, off)
}

function readU64(buf, off) {
  const hi = buf.readUInt32BE(off)
  const lo = buf.readUInt32BE(off + 4)
  return hi * 0x100000000 + lo
}

function writeU64(buf, off, value) {
  const hi = Math.floor(value / 0x100000000)
  const lo = value >>> 0
  buf.writeUInt32BE(hi, off)
  buf.writeUInt32BE(lo, off + 4)
}

function parseAtoms(buf) {
  const atoms = []
  let offset = 0
  while (offset + 8 <= buf.length) {
    let size = readU32(buf, offset)
    const type = buf.toString('ascii', offset + 4, offset + 8)
    let header = 8
    if (size === 1) {
      if (offset + 16 > buf.length) break
      size = Number(readU64(buf, offset + 8))
      header = 16
    } else if (size === 0) {
      size = buf.length - offset
    }
    if (size < header || offset + size > buf.length) break
    atoms.push({ type, offset, size, header })
    offset += size
  }
  return atoms
}

function patchChunkOffsets(moov, delta) {
  const stack = [{ offset: 8, end: moov.length }]
  while (stack.length) {
    const { offset, end } = stack.pop()
    let pos = offset
    while (pos + 8 <= end) {
      let size = readU32(moov, pos)
      const type = moov.toString('ascii', pos + 4, pos + 8)
      let header = 8
      if (size === 1) {
        size = Number(readU64(moov, pos + 8))
        header = 16
      } else if (size === 0) {
        size = end - pos
      }
      if (size < header || pos + size > end) break

      if (type === 'stco') {
        const entryCount = readU32(moov, pos + header + 4)
        let entry = pos + header + 8
        for (let i = 0; i < entryCount; i++) {
          writeU32(moov, entry, readU32(moov, entry) + delta)
          entry += 4
        }
      } else if (type === 'co64') {
        const entryCount = readU32(moov, pos + header + 4)
        let entry = pos + header + 8
        for (let i = 0; i < entryCount; i++) {
          writeU64(moov, entry, readU64(moov, entry) + delta)
          entry += 8
        }
      } else if (
        type === 'trak' || type === 'mdia' || type === 'minf' ||
        type === 'stbl' || type === 'moov' || type === 'edts' ||
        type === 'udta' || type === 'meta'
      ) {
        stack.push({ offset: pos + header, end: pos + size })
      }

      pos += size
    }
  }
}

function faststart(filePath) {
  const buf = fs.readFileSync(filePath)
  const atoms = parseAtoms(buf)
  const moov = atoms.find((a) => a.type === 'moov')
  const mdat = atoms.find((a) => a.type === 'mdat')

  if (!moov || !mdat) {
    return { status: 'skip', reason: 'missing moov/mdat' }
  }
  if (moov.offset < mdat.offset) {
    return { status: 'ok', reason: 'already faststart' }
  }

  const before = atoms.filter((a) => a.offset < moov.offset && a.type !== 'mdat' && a.type !== 'free')
  const mdatAtom = buf.subarray(mdat.offset, mdat.offset + mdat.size)
  const moovAtom = Buffer.from(buf.subarray(moov.offset, moov.offset + moov.size))

  // New layout: [ftyp...][moov][mdat]
  // moov moves earlier by (moov.offset - startAfterFtyp), so mdat shifts later by moov.size
  // Chunk offsets point into mdat; after rewrite, mdat starts right after moov.
  const prefix = Buffer.concat(before.map((a) => buf.subarray(a.offset, a.offset + a.size)))
  const newMdatOffset = prefix.length + moovAtom.length
  const oldMdatOffset = mdat.offset
  const delta = newMdatOffset - oldMdatOffset
  patchChunkOffsets(moovAtom, delta)

  const out = Buffer.concat([prefix, moovAtom, mdatAtom])
  const tmp = `${filePath}.faststart.tmp`
  fs.writeFileSync(tmp, out)
  fs.renameSync(tmp, filePath)
  return { status: 'fixed', delta, bytes: out.length }
}

const files = fs.readdirSync(ROOT).filter((f) => f.endsWith('.mp4')).sort()
let fixed = 0
let ok = 0
let failed = 0

for (const name of files) {
  const filePath = path.join(ROOT, name)
  try {
    const result = faststart(filePath)
    if (result.status === 'fixed') {
      fixed++
      console.log(`fixed  ${name} (+${result.delta} moov shift)`)
    } else if (result.status === 'ok') {
      ok++
      console.log(`ok     ${name}`)
    } else {
      console.log(`skip   ${name}: ${result.reason}`)
    }
  } catch (err) {
    failed++
    console.error(`fail   ${name}: ${err.message}`)
  }
}

console.log(`\nDone. fixed=${fixed} already-ok=${ok} failed=${failed}`)
