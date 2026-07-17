import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

test('hero video starts immediately while the poster hides blocked autoplay', async () => {
  const source = await read('components/hero-video.tsx')

  assert.match(source, /useRef<HTMLVideoElement>/)
  assert.doesNotMatch(source, /const \[mounted/)
  assert.match(source, /\.play\(\)\.catch/)
  assert.match(source, /onPlaying=\{\(\) => setVideoPlaying\(true\)\}/)
  assert.match(source, /aria-hidden="true"/)
  assert.match(source, /pointer-events-none/)
  assert.match(source, /controls=\{false\}/)
  assert.match(source, /disablePictureInPicture/)
  assert.match(source, /controlsList="nodownload nofullscreen noremoteplayback"/)
  assert.match(source, /poster="\/images\/hero\.png"/)
  assert.match(source, /videoPlaying \? 'opacity-0' : 'opacity-100'/)
  assert.doesNotMatch(source, /videoPlaying \? 'opacity-100' : 'opacity-0'/)
})
