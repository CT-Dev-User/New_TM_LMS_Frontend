{
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0"
  }
}
The issue: Your vite.config.js is importing the wrong plugin name. You have @vitejs/plugin-react-swc installed (which is faster), but your config is trying to import @vitejs/plugin-react.

Update your vite.config.js and push the changes - this should fix the build!








import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build',
  },
  server: {
    port: 3000,
  },
})