import { StrictMode } from 'react'
import { createRoot, ReactDOM } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { Theme } from '@radix-ui/themes'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Theme>
          <App />
      </Theme>
    </BrowserRouter>
  </StrictMode>,
)
