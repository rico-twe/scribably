import { writeFileSync, mkdirSync } from 'fs'
import { deflateSync } from 'zlib'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const root = resolve(__dirname, '..')

const CRC_TABLE = (() => {
  const t = new Int32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c
  }
  return t
})()

function crc32(buf) {
  let c = 0xffffffff
  for (const b of buf) c = (c >>> 8) ^ CRC_TABLE[(c ^ b) & 0xff]
  return (c ^ 0xffffffff) >>> 0
}

function pngChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii')
  const lenBuf = Buffer.allocUnsafe(4)
  const crcBuf = Buffer.allocUnsafe(4)
  lenBuf.writeUInt32BE(data.length)
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])))
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf])
}

function solidColorPng(w, h, r, g, b) {
  const ihdr = Buffer.allocUnsafe(13)
  ihdr.writeUInt32BE(w, 0)
  ihdr.writeUInt32BE(h, 4)
  ihdr[8] = 8   // bit depth
  ihdr[9] = 2   // color type: RGB
  ihdr[10] = 0  // compression method
  ihdr[11] = 0  // filter method
  ihdr[12] = 0  // interlace method

  // Raw image data: each row = 1 filter byte (None) + w × 3 RGB bytes
  const rowBytes = 1 + w * 3
  const raw = Buffer.alloc(h * rowBytes)
  for (let y = 0; y < h; y++) {
    const offset = y * rowBytes
    raw[offset] = 0 // filter: None
    for (let x = 0; x < w; x++) {
      raw[offset + 1 + x * 3] = r
      raw[offset + 1 + x * 3 + 1] = g
      raw[offset + 1 + x * 3 + 2] = b
    }
  }

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), // PNG signature
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', deflateSync(raw, { level: 9 })),
    pngChunk('IEND', Buffer.alloc(0)),
  ])
}

// OG image (1200×630): cream background matching site background (#fafaf7)
mkdirSync(resolve(root, 'public/og'), { recursive: true })
writeFileSync(
  resolve(root, 'public/og/scribably-cover.png'),
  solidColorPng(1200, 630, 0xfa, 0xfa, 0xf7)
)
console.log('✓ public/og/scribably-cover.png (1200×630)')

// Apple touch icon (180×180): matcha brand color (#4d7c52)
writeFileSync(
  resolve(root, 'public/apple-touch-icon.png'),
  solidColorPng(180, 180, 0x4d, 0x7c, 0x52)
)
console.log('✓ public/apple-touch-icon.png (180×180)')

console.log('\nNote: these are solid-color placeholder images.')
console.log('Replace with a designed version before deploying to production.')
