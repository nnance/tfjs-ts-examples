import * as tf from '@tensorflow/tfjs'
import * as fs from 'fs'
import { MnistData } from '../data/mnist'

const fileName = 'recognizeHandwriting'

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

export async function trainModel(
    model: tf.Sequential,
    data: MnistData,
    batchSize: number,
    trainDataSize: number,
    testDataSize: number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fitCallbacks?: any
) {
    const [trainXs, trainYs] = tf.tidy(() => {
        const d = data.nextTrainBatch(trainDataSize)
        return [d.xs.reshape([trainDataSize, 28, 28, 1]), d.labels]
    })

    const [testXs, testYs] = tf.tidy(() => {
        const d = data.nextTestBatch(testDataSize)
        return [d.xs.reshape([testDataSize, 28, 28, 1]), d.labels]
    })

    return model.fit(trainXs, trainYs, {
        batchSize,
        validationData: [testXs, testYs],
        epochs: 10,
        shuffle: true,
        callbacks: fitCallbacks,
    })
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
