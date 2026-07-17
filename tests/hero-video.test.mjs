import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

test('hero video stays an inert background and falls back when autoplay is blocked', async () => {
  const source = await read('components/hero-video.tsx')

  assert.match(source, /useRef<HTMLVideoElement>/)
  assert.match(source, /\.play\(\)\.catch/)
  assert.match(source, /onPlaying=\{\(\) => setVideoPlaying\(true\)\}/)
  assert.match(source, /aria-hidden="true"/)
  assert.match(source, /pointer-events-none/)
  assert.match(source, /controls=\{false\}/)
  assert.match(source, /disablePictureInPicture/)
  assert.match(source, /controlsList="nodownload nofullscreen noremoteplayback"/)
  assert.match(source, /videoPlaying \? 'opacity-100' : 'opacity-0'/)
})
