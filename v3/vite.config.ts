import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { rmSync } from 'node:fs'
import { isAbsolute, join, relative, resolve } from 'node:path'

const workspace = fileURLToPath(new URL('.', import.meta.url))
const serviceMasters = ['camerarig.png', 'MR-headphones.png', 'gooey-mrsmooth.png']

export default defineConfig(({ command }) => ({
  plugins: [react(), {
    name: 'omit-replaced-service-masters',
    apply: 'build',
    writeBundle(output) {
      // Retain editable PNG sources, but ship only their verified lossless copies.
      // Constrain generated-file cleanup to this project, including custom outDir.
      const directory = resolve(workspace, output.dir ?? 'dist')
      const within = relative(workspace, directory)
      if (!within || within.startsWith('..') || isAbsolute(within)) return
      for (const name of serviceMasters) rmSync(join(directory, 'products', name), { force: true })
    },
  }],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@home-leva': command === 'build' ? fileURLToPath(new URL('./src/lib/productionTuners.ts', import.meta.url)) : 'leva',
    },
  },
  server: {
    port: 5175,
    host: true,
  },
}))
