import * as React from 'react'
import { render } from 'preact/compat'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App'

render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>,
    document.body
)
