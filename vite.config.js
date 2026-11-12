import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // three.js and the shader libraries change far less often than the
        // site, so they get chunks of their own that stay cached across deploys
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (/node_modules\/(three|@react-three)\//.test(id)) return 'three'
          if (id.includes('node_modules/@paper-design/')) return 'shaders'
          if (/node_modules\/(react|react-dom|react-router|react-router-dom|scheduler)\//.test(id)) return 'react'
        },
      },
    },
  },
})
