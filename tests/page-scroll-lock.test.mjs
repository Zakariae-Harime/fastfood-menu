import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import ts from 'typescript'

const require = createRequire(import.meta.url)
require.extensions['.ts'] = (module, filename) => {
  const source = readFileSync(filename, 'utf8')
  const output = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText
  module._compile(output, filename)
}

test('locks the page behind the cart and restores its original position', () => {
  const originalWindow = globalThis.window
  const originalDocument = globalThis.document
  const scrollCalls = []
  const style = {
    overflow: 'auto',
    position: 'relative',
    top: '2px',
    width: '90%',
  }
  const rootStyle = { scrollBehavior: 'smooth' }

  globalThis.window = {
    scrollY: 640,
    scrollTo: (...args) => scrollCalls.push(args),
  }
  globalThis.document = {
    body: { style },
    documentElement: { style: rootStyle },
  }

  try {
    const { lockPageScroll } = require('../lib/page-scroll-lock.ts')
    const unlock = lockPageScroll()

    assert.equal(style.overflow, 'hidden')
    assert.equal(style.position, 'fixed')
    assert.equal(style.top, '-640px')
    assert.equal(style.width, '100%')
    assert.equal(rootStyle.scrollBehavior, 'auto')

    unlock()

    assert.deepEqual(style, {
      overflow: 'auto',
      position: 'relative',
      top: '2px',
      width: '90%',
    })
    assert.deepEqual(scrollCalls, [[0, 640]])
    assert.equal(rootStyle.scrollBehavior, 'smooth')
  } finally {
    globalThis.window = originalWindow
    globalThis.document = originalDocument
  }
})
