import * as tf from '@tensorflow/tfjs-node-gpu'
import * as fs from 'fs'
import { CarPerformance } from '../api/cars'

const fileName = 'carPerformanceModel'

export function createModel() {
    // Create a sequential model
    const model = tf.sequential()

    // Add a single input layer
    model.add(tf.layers.dense({ inputShape: [1], units: 1, useBias: true }))

    // Add an output layer
    model.add(tf.layers.dense({ units: 1, useBias: true }))

    return model
}

/**
 * Convert the input data to tensors that we can use for machine
 * learning. We will also do the important best practices of _shuffling_
 * the data and _normalizing_ the data
 * MPG on the y-axis.
 */
export function convertToTensor(data: CarPerformance[]) {
    // Wrapping these calculations in a tidy will dispose any
    // intermediate tensors.

    return tf.tidy(() => {
        // Step 1. Shuffle the data
        tf.util.shuffle(data)

        // Step 2. Convert data to Tensor
        const inputs = data.map((d) => d.horsepower)
        const labels = data.map((d) => d.mpg)

        const inputTensor = tf.tensor2d(inputs, [inputs.length, 1])
        const labelTensor = tf.tensor2d(labels, [labels.length, 1])

        //Step 3. Normalize the data to the range 0 - 1 using min-max scaling
        const inputMax = inputTensor.max()
        const inputMin = inputTensor.min()
        const labelMax = labelTensor.max()
        const labelMin = labelTensor.min()

        const normalizedInputs = inputTensor
            .sub(inputMin)
            .div(inputMax.sub(inputMin))
        const normalizedLabels = labelTensor
            .sub(labelMin)
            .div(labelMax.sub(labelMin))

        return {
            inputs: normalizedInputs,
            labels: normalizedLabels,
            // Return the min/max bounds so we can use them later.
            inputMax,
            inputMin,
            labelMax,
            labelMin,
        }
    })
}

export async function trainModel(
    model: tf.Sequential,
    inputs: tf.Tensor<tf.Rank>,
    labels: tf.Tensor<tf.Rank>
) {
    // Prepare the model for training.
    model.compile({
        optimizer: tf.train.adam(),
        loss: tf.losses.meanSquaredError,
        metrics: ['mse'],
    })

    const batchSize = 32
    const epochs = 50

    return await model.fit(inputs, labels, {
        batchSize,
        epochs,
        shuffle: true,
    })
}

export function testModel(
    model: tf.LayersModel,
    normalizationData: ReturnType<typeof convertToTensor>
) {
    const { inputMax, inputMin, labelMin, labelMax } = normalizationData

    // Generate predictions for a uniform range of numbers between 0 and 1;
    // We un-normalize the data by doing the inverse of the min-max scaling
    // that we did earlier.
    const [xs, preds] = tf.tidy(() => {
        const xs = tf.linspace(0, 1, 100)
        const preds = model.predict(xs.reshape([100, 1])) as tf.Tensor<tf.Rank>

        const unNormXs = xs.mul(inputMax.sub(inputMin)).add(inputMin)

        const unNormPreds = preds.mul(labelMax.sub(labelMin)).add(labelMin)

        // Un-normalize the data
        return [unNormXs.dataSync(), unNormPreds.dataSync()]
    })

    const predictedPoints = Array.from(xs).map((val, i) => ({
        x: val,
        y: preds[i],
    }))

    return predictedPoints
}

export function saveModel(model: tf.Sequential) {
    if (!fs.existsSync('./.artifacts')) {
        fs.mkdirSync('./.artifacts')
    }
    return model.save(`file://.artifacts/${fileName}`)
}

export function loadModel() {
    return tf.loadLayersModel(`file://.artifacts/${fileName}/model.json`)
}
