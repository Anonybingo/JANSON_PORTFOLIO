import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' lets the built site work from any folder or sub-path
export default defineConfig({ plugins: [react()], base: './', build: { assetsInlineLimit: 100000 } })
