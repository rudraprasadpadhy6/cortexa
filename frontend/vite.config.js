import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const targetUrl = env.VITE_API_BASE_URL 
    ? env.VITE_API_BASE_URL.replace(/\/api$/, '') 
    : 'http://localhost:5000';

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: targetUrl,
          changeOrigin: true,
        }
      }
    }
  };
})
