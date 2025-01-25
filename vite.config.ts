import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [TanStackRouterVite({}), react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components')
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['@rocicorp/zero', '@rocicorp/zero/react'],
          aws: ['@aws-sdk/client-s3'],
          clerk: ['@clerk/clerk-react'],
          react: ['react', 'react-dom'],
          tanstack: ['@tanstack/react-router', '@tanstack/router-devtools'],
          mdxEditor: ['@mdxeditor/editor'],
        }
      }
    }
  }
})
