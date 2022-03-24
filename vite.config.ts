import {resolve} from 'node:path'
import {defineConfig} from 'vite'
import dts from 'vite-plugin-dts'
import {EsLinter, linterPlugin} from 'vite-plugin-linter'

export default defineConfig(configEnv => ({
  build: {
    lib: {
      entry: resolve('src', 'main.ts'),
      name: 'PersonClassification',
      fileName: format => `person-classification.${format}.js`,
    },
    rollupOptions: {
      output: {
        exports: 'named',
      },
    },
  },
  plugins: [
    linterPlugin({
      include: ['./src}/**/*.{ts,tsx}'],
      linters: [new EsLinter({configEnv})],
    }),
    dts(),
  ],
}))
