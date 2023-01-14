import * as fs from 'fs'
import * as tf from '@tensorflow/tfjs-node-gpu'
import { getData } from '../data/cars'
import * as predict from '../models/predict-2d-data'
import * as handwriting from '../models/recognize-handwriting'
import {
    perClassAccuracy,
    printEvaluationResult,
    printPerClassAccuracy,
} from '../models/metrics'
import { batchToTensors, getBatch, loadAllData } from '../data/mnist-node'

export const defaultPath = './.artifacts'

async function saveModel(model: tf.Sequential, path: string, fileName: string) {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path)
    }
    const results = await model.save(`file://${path}/${fileName}`)
    console.log(
        `Model saved as ${results.modelArtifactsInfo.modelTopologyType} to ${path}/${fileName}`
    )
}

function saveResults(
    path: string,
    fileName: string,
    results: ReturnType<typeof getHandwritingTrainingResults>
) {
    const resultsFileName = `${path}/${fileName}/results.json`
    fs.writeFileSync(resultsFileName, JSON.stringify(results, null, 2))
    console.log(`Training results saved to ${resultsFileName}`)
}

export function getHandwritingTrainingResults(
    history: tf.History,
    batchHistory: tf.Logs[],
    accuracy: Awaited<ReturnType<typeof perClassAccuracy>>
) {
    return { ...history, batchHistory, accuracy }
}

export async function trainHandwriting(
    epochs = 10,
    batchSize = 512,
    modelSavePath = defaultPath
) {
    const { createModel, fileName } = handwriting

    const model = createModel()
    model.summary()

    const dataset = await loadAllData()
    const trainingSet = getBatch(dataset, true)
    const { images: trainImages, labels: trainLabels } =
        batchToTensors(trainingSet)

    const batchHistory: tf.Logs[] = []
    function onBatchEnd(batch: number, logs?: tf.Logs) {
        if (logs) batchHistory.push(logs)
    }

    const validationSplit = 0.15
    const history = await model.fit(trainImages, trainLabels, {
        epochs,
        batchSize,
        validationSplit,
        callbacks: {
            onBatchEnd,
        },
    })

    console.log('Training completed\n')

    await saveModel(model, modelSavePath, fileName)

    const testSet = getBatch(dataset, false)
    const { images: testImages, labels: testLabels } = batchToTensors(testSet)

    const evalOutput = model.evaluate(testImages, testLabels)
    if (!Array.isArray(evalOutput)) return
    printEvaluationResult(evalOutput)

    const preds = model.predict(testImages) as tf.Tensor<tf.Rank>
    const accuracy = await perClassAccuracy(
        preds.argMax(-1),
        testLabels.argMax(-1)
    )
    printPerClassAccuracy(accuracy)

    const results = getHandwritingTrainingResults(
        history,
        batchHistory,
        accuracy
    )
    saveResults(modelSavePath, fileName, results)
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
    await saveModel(model, modelSavePath, fileName)
}
