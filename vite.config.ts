import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        //additionalData: `@use '@coreui/coreui/scss/mixins'; @import "@/src/assets/styles/scss/_variables.scss";`
      }
    }
  },
  plugins: [
    react(),
    svgr()
  ],
  build: {
    rollupOptions:{
      output: {
        assetFileNames: `metaverses-estates-app/assets/[name]-[hash][extname]`,
        chunkFileNames: `metaverses-estates-app/assets/[name]-[hash].js`,
        entryFileNames: `metaverses-estates-app/assets/[name]-[hash].js`,
      },
    },
  },
})
