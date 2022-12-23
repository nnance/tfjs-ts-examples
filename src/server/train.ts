import * as fs from 'fs'
import * as tf from '@tensorflow/tfjs-node-gpu'
import { getData } from '../data/cars'
import * as predict from '../models/predict-2d-data'
import * as handwriting from '../models/recognize-handwriting'
import { MnistData } from '../data/mnist-node'

export const defaultPath = './.artifacts'

function saveModel(model: tf.Sequential, path: string, fileName: string) {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path)
    }
    return model.save(`file://${path}/${fileName}`)
}

export async function trainHandwriting(
    epochs = 20,
    batchSize = 128,
    modelSavePath = defaultPath
) {
    const { createModel, fileName } = handwriting

    const data = new MnistData()
    const model = createModel()
    await data.loadData()

    const { images: trainImages, labels: trainLabels } = data.getTrainData()
    model.summary()

    const validationSplit = 0.15
    await model.fit(trainImages, trainLabels, {
        epochs,
        batchSize,
        validationSplit,
    })

    const { images: testImages, labels: testLabels } = data.getTestData()
    const evalOutput = model.evaluate(testImages, testLabels)

    if (!Array.isArray(evalOutput)) return

    console.log(
        `\nEvaluation result:\n` +
            `  Loss = ${evalOutput[0].dataSync()[0].toFixed(3)}; ` +
            `Accuracy = ${evalOutput[1].dataSync()[0].toFixed(3)}`
    )
    console.log('Training completed')

    const results = await saveModel(model, modelSavePath, fileName)
    console.log(
        `Model saved as ${results.modelArtifactsInfo.modelTopologyType}`
    )
}

export async function trainPrediction(
    epochs = 50,
    batchSize = 32,
    modelSavePath = defaultPath
) {
    const { createModel, convertToTensor, fileName } = predict

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

    const model = createModel()
    const data = await getData()

    // Convert the data to a form we can use for training.
    const tensorData = convertToTensor(data)
    const { inputs, labels } = tensorData

    // Train the model
    await trainModel(model, inputs, labels, epochs, batchSize)
    console.log('Done Training')
    const results = await saveModel(model, modelSavePath, fileName)
    console.log(
        `Model saved as ${results.modelArtifactsInfo.modelTopologyType}`
    )
}
