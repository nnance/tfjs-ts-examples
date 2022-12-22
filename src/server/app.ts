import express from 'express'
import cors from 'cors'
import { loadModel } from '../models/predict-2d-data'
import { getData } from '../data/cars'
import { echoHandler, EchoURL, getPredictions } from './api'
import { defaultPath } from './train'

export function getServer(modelPath = defaultPath) {
    const app = express()
    app.use(cors({ origin: '*' }))
    app.use(express.json())

    app.post(EchoURL, (req, res) => {
        res.json(echoHandler(req.body))
    })

    app.get('/simple-predictions/test', async (req, res) => {
        const model = await loadModel(modelPath)
        const data = await getData()
        const predications = getPredictions(model, data)
        res.json(predications)
    })

    return app
}
