import * as fs from 'fs'
import * as tf from '@tensorflow/tfjs-node-gpu'
import { getData } from '../data/cars'
import * as predict from '../models/predict-2d-data'
import * as handwriting from '../models/recognize-handwriting'
import { MnistData } from '../data/mnist'

export const defaultPath = './.artifacts'

export async function trainHandwriting() {
    const { createModel, trainModel, saveModel } = handwriting

    const model = createModel()
    const data = new MnistData()

    // Train the model
    await trainModel(model, data, 512, 5500, 1000)
    console.log('Training completed')
    const results = await saveModel(model)
    console.log(
        `Model saved as ${results.modelArtifactsInfo.modelTopologyType}`
    )
}

export async function trainPrediction(
    epochs = 50,
    batchSize = 32,
    modelSavePath = defaultPath
) {
    const { createModel, convertToTensor } = predict

    async function trainModel(
        model: tf.Sequential,
        inputs: tf.Tensor<tf.Rank>,
        labels: tf.Tensor<tf.Rank>,
        batchSize = 32,
        epochs = 50
    ) {
        // Prepare the model for training.
        model.compile({
            optimizer: tf.train.adam(),
            loss: tf.losses.meanSquaredError,
            metrics: ['mse'],
        })

        return await model.fit(inputs, labels, {
            batchSize,
            epochs,
            shuffle: true,
        })
    }

    function saveModel(model: tf.Sequential, path: string) {
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path)
        }
        return model.save(`file://${path}/${predict.fileName}`)
    }

    const model = createModel()
    const data = await getData()

    // Convert the data to a form we can use for training.
    const tensorData = convertToTensor(data)
    const { inputs, labels } = tensorData

    // Train the model
    await trainModel(model, inputs, labels, epochs, batchSize)
    console.log('Done Training')
    const results = await saveModel(model, modelSavePath)
    console.log(
        `Model saved as ${results.modelArtifactsInfo.modelTopologyType}`
    )
}
