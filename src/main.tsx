import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

if (import.meta.env.DEV) {
  import('@locator/runtime').then((locator) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(locator as any).setupRuntime({ adapter: 'react' })
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
