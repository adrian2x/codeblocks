import { defineConfig, splitVendorChunkPlugin } from 'vite'
import preact from '@preact/preset-vite'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      react: 'preact/compat',
      'react-dom': 'preact/compat'
    }
  },
  plugins: [preact(), splitVendorChunkPlugin()],
  build: {
    rollupOptions: {
      input: {
        index: new URL('./index.html', import.meta.url).pathname,
        post: new URL('./post.html', import.meta.url).pathname,
        profile: new URL('./profile.html', import.meta.url).pathname
      },
      output: {
        manualChunks: {
          firebase: ['firebase/compat/app', 'firebase/compat/auth', 'firebaseui'],
          'react-router-dom': ['react-router-dom'],
          'react-instantsearch-hooks-web': ['algoliasearch/lite', 'react-instantsearch-hooks-web']
        }
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false
        // rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
