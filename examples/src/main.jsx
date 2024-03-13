import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

import { QueryProvider } from "./hooks"

import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryProvider>
    <App />
  </QueryProvider>,
)