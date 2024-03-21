import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

import { QueryProvider } from './hooks'

import store from './store.js'
import authDispatcher from './dispatchers/authDispatcher.js'

import './index.css'

const dispatchers = [
  authDispatcher,
]

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryProvider store={store} dispatchers={dispatchers}>
    <App />
  </QueryProvider>,
)