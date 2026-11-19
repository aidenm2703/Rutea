import process from 'node:process'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const proxy = {
  '/api': process.env.RUTEA_API_TARGET ?? 'http://localhost:3000',
}

export default defineConfig({
  plugins: [react()],
  server: { proxy },
  preview: { proxy },
})

