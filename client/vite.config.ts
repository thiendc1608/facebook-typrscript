import { defineConfig } from 'vite'
import path from "path"
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/api/v1': {
        target: 'http://localhost:8000', // URL của server API
        changeOrigin: true,  // Đảm bảo các yêu cầu được gửi đến server đúng
      }
    }
  }
})
