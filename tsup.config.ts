import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/server.ts'],
  format: ['esm'],       // Garante o formato ES Modules
  clean: true,          // Limpa a pasta dist antes de cada build
  outDir: 'build',      // Pasta de saída (opcional, mude se preferir 'dist')
})