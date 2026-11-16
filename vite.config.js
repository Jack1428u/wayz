import { defineConfig } from 'vite';

// base './' hace que las rutas de CSS, JS e imágenes sean relativas: la carpeta dist/ funciona en cualquier hosting estático.
export default defineConfig({
  base: './',
  server: { port: 5500 },
  build: { outDir: 'dist', sourcemap: false },
});
