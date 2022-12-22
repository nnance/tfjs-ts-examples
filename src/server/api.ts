import { LayersModel } from '@tensorflow/tfjs'
import { CarPerformance } from '../data/cars'
import { convertToTensor, testModel } from '../models/predict-2d-data'

export type EchoProps = {
    message: string
}

export function echoHandler({ message }: EchoProps) {
    return { echo: message }
}

export const EchoURL = '/echo'

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
