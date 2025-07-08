import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { execSync } from 'child_process'

function getGitInfo() {
  try {
    const hash = execSync('git rev-parse --short HEAD').toString().trim()
    const msg = execSync('git log -1 --pretty=%s').toString().trim()
    return { hash, msg }
  } catch {
    return { hash: 'unknown', msg: 'unknown' }
  }
}

const git = getGitInfo()

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    __COMMIT_HASH__: JSON.stringify(git.hash),
    __COMMIT_MSG__: JSON.stringify(git.msg),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: '/webappx/', // 👈 IMPORTANT!
})
