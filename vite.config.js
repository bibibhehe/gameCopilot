import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Đảm bảo đường dẫn tương đối khi deploy lên GitHub Pages
})
