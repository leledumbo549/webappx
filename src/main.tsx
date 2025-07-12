import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { initDrizzle } from '../server/db'

async function enableMocking() {
  await initDrizzle()
  const { worker } = await import('./mocks/browser')
  await worker.start({
    serviceWorker: { url: '/webappx/mockServiceWorker.js' },
  })
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
})
