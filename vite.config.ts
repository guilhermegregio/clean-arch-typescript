import {resolve} from 'node:path'
import {defineConfig} from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig(() => ({
  build: {
    lib: {
      entry: resolve('src', 'main.ts'),
      name: 'CleanArchTypescript',
      fileName: format => `clean-arch-typescript.${format}.js`,
    },
    rollupOptions: {
      output: {
        exports: 'named',
      },
    },
  },
  plugins: [dts()],
}))
