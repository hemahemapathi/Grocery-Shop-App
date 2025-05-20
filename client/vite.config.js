import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
// https://vitejs.dev/config/

export default defineConfig({
  plugins: [react()],
    publicDir: 'public',
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Change this to your backend server URL
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'http://localhost:5000', // Change this to your backend server URL
        changeOrigin: true,
        secure: false,
      }
    }
  }
});




