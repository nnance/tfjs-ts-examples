import express from 'express'
import cors from 'cors'
import { defaultPath } from './train'

export function getServer(modelPath = defaultPath) {
    const app = express()
    app.use(cors({ origin: '*' }))
    app.use(express.json())

    // serve static files
    app.use('/models', express.static(modelPath))

    return app
}
