import express from 'express'
import cors from 'cors'
import * as EchoAPI from '../api/Echo'
import {
    convertToTensor,
    loadModel,
    testModel,
} from '../models/simple-number-prediction'
import { CarPerformance, getData } from '../api/cars'
import { LayersModel } from '@tensorflow/tfjs-layers'

const app = express()
app.use(cors({ origin: '*' }))
app.use(express.json())

const echoHandler = (req: EchoAPI.Request): EchoAPI.Response => {
    const { message } = req
    return { echo: message }
}

app.post(EchoAPI.URL, (req, res) => {
    res.json(echoHandler(req.body))
})

export function getPredictions(model: LayersModel, data: CarPerformance[]) {
    const tensorData = convertToTensor(data)
    const predictedPoints = testModel(model, tensorData)

    const originalPoints = data.map((d) => ({
        x: d.horsepower,
        y: d.mpg,
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
