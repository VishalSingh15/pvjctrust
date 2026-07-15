import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâ€”file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          about: path.resolve(__dirname, 'about.html'),
          'confirm-donation': path.resolve(__dirname, 'confirm-donation.html'),
          contact: path.resolve(__dirname, 'contact.html'),
          donate: path.resolve(__dirname, 'donate.html'),
          education: path.resolve(__dirname, 'education.html'),
          environment: path.resolve(__dirname, 'environment.html'),
          foodstuffs: path.resolve(__dirname, 'foodstuffs.html'),
          gallery: path.resolve(__dirname, 'gallery.html'),
          healthcare: path.resolve(__dirname, 'healthcare.html'),
        },
      },
    },
  };
});
