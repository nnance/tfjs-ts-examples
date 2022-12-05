import express from 'express'
import cors from 'cors'
import {
    convertToTensor,
    loadModel,
    testModel,
} from '../models/predict-2d-data'
import { CarPerformance, getData } from './cars'
import { LayersModel } from '@tensorflow/tfjs-layers'
import { echoHandler, EchoURL } from './api'

const app = express()
app.use(cors({ origin: '*' }))
app.use(express.json())

app.post(EchoURL, (req, res) => {
    res.json(echoHandler(req.body))
})

export function getPredictions(
    model: LayersModel,
    originalPoints: CarPerformance[]
) {
    const tensorData = convertToTensor(originalPoints)
    const predications = testModel(model, tensorData)

    const predictedPoints = predications.map((d) => ({
        horsepower: d.x,
        mpg: d.y,
    }))

    return { predictedPoints, originalPoints }
}

app.get('/simple-predictions/test', async (req, res) => {
    const model = await loadModel()
    const data = await getData()
    const predications = getPredictions(model, data)
    res.json(predications)
})

app.listen(8080)
