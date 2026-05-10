import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd() + '/..', '')
  const serverPort = parseInt(env.SERVER_PORT) || 3001
  const clientPort = parseInt(env.CLIENT_PORT) || 5173

  return {
    plugins: [vue()],
    server: {
      port: clientPort,
      proxy: {
        '/socket.io': {
          target: `http://localhost:${serverPort}`,
          ws: true
        }
      }
    },
    define: {
      'import.meta.env.VITE_SERVER_PORT': JSON.stringify(serverPort)
    }
  }
})
