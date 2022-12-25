import * as tf from '@tensorflow/tfjs'
import { Batch, MnistData } from '../data/mnist'

export const fileName = 'recognizeHandwriting'

export function createModel() {
    const model = tf.sequential()

    const IMAGE_WIDTH = 28
    const IMAGE_HEIGHT = 28
    const IMAGE_CHANNELS = 1

    // In the first layer of our convolutional neural network we have
    // to specify the input shape. Then we specify some parameters for
    // the convolution operation that takes place in this layer.
    model.add(
        tf.layers.conv2d({
            inputShape: [IMAGE_WIDTH, IMAGE_HEIGHT, IMAGE_CHANNELS],
            kernelSize: 5,
            filters: 8,
            strides: 1,
            activation: 'relu',
            kernelInitializer: 'varianceScaling',
        })
    )

    // The MaxPooling layer acts as a sort of downsampling using max values
    // in a region instead of averaging.
    model.add(tf.layers.maxPooling2d({ poolSize: [2, 2], strides: [2, 2] }))

    // Repeat another conv2d + maxPooling stack.
    // Note that we have more filters in the convolution.
    model.add(
        tf.layers.conv2d({
            kernelSize: 5,
            filters: 16,
            strides: 1,
            activation: 'relu',
            kernelInitializer: 'varianceScaling',
        })
    )
    model.add(tf.layers.maxPooling2d({ poolSize: [2, 2], strides: [2, 2] }))

    // Now we flatten the output from the 2D filters into a 1D vector to prepare
    // it for input into our last layer. This is common practice when feeding
    // higher dimensional data to a final classification output layer.
    model.add(tf.layers.flatten())

    // Our last layer is a dense layer which has 10 output units, one for each
    // output class (i.e. 0, 1, 2, 3, 4, 5, 6, 7, 8, 9).
    const NUM_OUTPUT_CLASSES = 10
    model.add(
        tf.layers.dense({
            units: NUM_OUTPUT_CLASSES,
            kernelInitializer: 'varianceScaling',
            activation: 'softmax',
        })
    )

    // Choose an optimizer, loss function and accuracy metric,
    // then compile and return the model
    const optimizer = tf.train.adam()
    model.compile({
        optimizer: optimizer,
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy'],
    })

    return model
}

export async function renderExamples(
    canvas: HTMLCanvasElement,
    data: MnistData
) {
    // Get the examples
    const examples = data.nextTestBatch(20)
    const numExamples = examples.xs.shape[0]

    const images: ImageData[] = []
    for (let i = 0; i < numExamples; i++) {
        // Create a canvas element to render each example

        const imageTensor = tf.tidy(() => {
            // Reshape the image to 28x28 px
            return examples.xs
                .slice([i, 0], [1, examples.xs.shape[1]])
                .reshape([28, 28, 1])
        })
        await tf.browser.toPixels(imageTensor as tf.Tensor2D, canvas)
        imageTensor.dispose()

        const ctx = canvas.getContext('2d', { willReadFrequently: true })
        if (ctx) {
            const imageData = ctx.getImageData(0, 0, 28, 28)
            if (imageData) images.push(imageData)
        }
    }
    return { examples, images }
}

const classNames = [
    'Zero',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
]

function doPrediction(
    model: tf.LayersModel,
    testData: Batch,
    testDataSize = 20
) {
    const IMAGE_WIDTH = 28
    const IMAGE_HEIGHT = 28
    const testxs = testData.xs.reshape([
        testDataSize,
        IMAGE_WIDTH,
        IMAGE_HEIGHT,
        1,
    ])
    const rank = model.predict(testxs) as tf.Tensor<tf.Rank>

    testxs.dispose()
    // TODO: dispose labels?

    return rank
}

function getMaxValues(rank: tf.Tensor<tf.Rank>, classNames: string[]) {
    const maxValues = rank.argMax(-1).arraySync() as number[][]

    return maxValues.map((value, i) => ({
        className: classNames[i],
        value,
    }))
}

interface LayerSummary {
    name: string
    trainable: boolean
    parameters: number
    outputShape: string
}

function formatShape(shape: number[]): string {
    const oShape: Array<number | string> = shape.slice()
    if (oShape.length === 0) {
        return 'Scalar'
    }
    if (oShape[0] === null) {
        oShape[0] = 'batch'
    }
    return `[${oShape.join(',')}]`
}

/*
 * Gets summary information/metadata about a layer.
 */
function getLayerSummary(layer: tf.layers.Layer): LayerSummary {
    let outputShape: string
    if (Array.isArray(layer.outputShape[0])) {
        const shapes = (layer.outputShape as number[][]).map((s) =>
            formatShape(s)
        )
        outputShape = `[${shapes.join(', ')}]`
    } else {
        outputShape = formatShape(layer.outputShape as number[])
    }

    return {
        name: layer.name,
        trainable: layer.trainable,
        parameters: layer.countParams(),
        outputShape,
    }
}

function getTopKClasses(rank: tf.Tensor<tf.Rank>, classNames: string[]) {
    const { values, indices } = tf.topk(rank, 3)

    const topKValues = values.arraySync() as number[][]
    const topKIndices = indices.arraySync() as number[][]

    return topKValues.map((v, i) => ({
        className: classNames[topKIndices[i][0]],
        value: v[0],
    }))
}

export type PredictionResults = ReturnType<typeof predict>

const predict = (model: tf.LayersModel, testData: Batch, testDataSize = 20) => {
    const rank = doPrediction(model, testData, testDataSize)
    const topK = getTopKClasses(rank, classNames)
    tf.dispose(rank)
    return topK
}

export type TrainedModel = Awaited<ReturnType<typeof loadTrainedModel>>

export async function loadTrainedModel() {
    const model = await tf.loadLayersModel(
        `http://localhost:8080/models/${fileName}/model.json`
    )

    return {
        summary: () => model.layers.map(getLayerSummary),
        predict: (testData: Batch, testDataSize = 20) =>
            predict(model, testData, testDataSize),
        predictWithValues: (testData: Batch, testDataSize = 20) => {
            const rank = doPrediction(model, testData, testDataSize)
            const maxValues = getMaxValues(rank, classNames)
            tf.dispose(rank)
            return maxValues
        },
    }
}
