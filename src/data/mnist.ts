/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

import * as tf from '@tensorflow/tfjs'

const IMAGE_SIZE = 784
const NUM_CLASSES = 10
const NUM_DATASET_ELEMENTS = 65000

const TRAIN_TEST_RATIO = 5 / 6

const NUM_TRAIN_ELEMENTS = Math.floor(TRAIN_TEST_RATIO * NUM_DATASET_ELEMENTS)
const NUM_TEST_ELEMENTS = NUM_DATASET_ELEMENTS - NUM_TRAIN_ELEMENTS

const MNIST_IMAGES_SPRITE_PATH =
    'https://storage.googleapis.com/learnjs-data/model-builder/mnist_images.png'
const MNIST_LABELS_PATH =
    'https://storage.googleapis.com/learnjs-data/model-builder/mnist_labels_uint8'

export type Batch = {
    xs: tf.Tensor2D
    labels: tf.Tensor2D
}

// get an image by index from the test data set as ImageData
async function getImageData(index: number, testData: Batch) {
    const imageTensor = tf.tidy(() => {
        // Reshape the image to 28x28 px
        return testData.xs
            .slice([index, 0], [1, testData.xs.shape[1]])
            .reshape([28, 28, 1])
    })
    const imageData = await tf.browser.toPixels(imageTensor as tf.Tensor2D)
    imageTensor.dispose()
    return new ImageData(imageData, 28, 28)
}

// get image count from the test data set
function getImageCount(testData: Batch) {
    return testData.xs.shape[0]
}

async function loadCanvasImage() {
    // Make a request for the MNIST sprited image.
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    const imgRequest = new Promise<Float32Array>((resolve) => {
        if (!ctx) {
            resolve(new Float32Array())
            return
        }

        img.crossOrigin = ''
        img.onload = () => {
            img.width = img.naturalWidth
            img.height = img.naturalHeight

            const datasetBytesBuffer = new ArrayBuffer(
                NUM_DATASET_ELEMENTS * IMAGE_SIZE * 4
            )

            const chunkSize = 5000
            canvas.width = img.width
            canvas.height = chunkSize

            for (let i = 0; i < NUM_DATASET_ELEMENTS / chunkSize; i++) {
                const datasetBytesView = new Float32Array(
                    datasetBytesBuffer,
                    i * IMAGE_SIZE * chunkSize * 4,
                    IMAGE_SIZE * chunkSize
                )
                ctx.drawImage(
                    img,
                    0,
                    i * chunkSize,
                    img.width,
                    chunkSize,
                    0,
                    0,
                    img.width,
                    chunkSize
                )

                const imageData = ctx.getImageData(
                    0,
                    0,
                    canvas.width,
                    canvas.height
                )

                for (let j = 0; j < imageData.data.length / 4; j++) {
                    // All channels hold an equal value since the image is grayscale, so
                    // just read the red channel.
                    datasetBytesView[j] = imageData.data[j * 4] / 255
                }
            }
            const datasetImages = new Float32Array(datasetBytesBuffer)

            resolve(datasetImages)
        }
        img.src = MNIST_IMAGES_SPRITE_PATH
    })

    const labelsRequest = fetch(MNIST_LABELS_PATH)
    const [images, labelsResponse] = await Promise.all([
        imgRequest,
        labelsRequest,
    ])

    const labels = new Uint8Array(await labelsResponse.arrayBuffer())

    return {
        images,
        labels,
        size: NUM_DATASET_ELEMENTS,
    }
}

function splitDataset(
    images: Float32Array,
    labels: Uint8Array
): [Float32Array, Uint8Array, Float32Array, Uint8Array] {
    // Slice the the images and labels into train and test sets.
    const trainImages = images.slice(0, IMAGE_SIZE * NUM_TRAIN_ELEMENTS)
    const testImages = images.slice(IMAGE_SIZE * NUM_TEST_ELEMENTS)
    const trainLabels = labels.slice(0, NUM_CLASSES * NUM_TRAIN_ELEMENTS)
    const testLabels = labels.slice(NUM_CLASSES * NUM_TEST_ELEMENTS)

    return [trainImages, trainLabels, testImages, testLabels]
}

const nextBatch =
    (images: Float32Array, classes: Uint8Array, index: () => number) =>
    (batchSize: number) => {
        const batchImagesArray = new Float32Array(batchSize * IMAGE_SIZE)
        const batchLabelsArray = new Uint8Array(batchSize * NUM_CLASSES)

        for (let i = 0; i < batchSize; i++) {
            const idx = index()

            const image = images.slice(
                idx * IMAGE_SIZE,
                idx * IMAGE_SIZE + IMAGE_SIZE
            )
            batchImagesArray.set(image, i * IMAGE_SIZE)

            const label = classes.slice(
                idx * NUM_CLASSES,
                idx * NUM_CLASSES + NUM_CLASSES
            )
            batchLabelsArray.set(label, i * NUM_CLASSES)
        }

        const xs = tf.tensor2d(batchImagesArray, [batchSize, IMAGE_SIZE])
        const labels = tf.tensor2d(batchLabelsArray, [batchSize, NUM_CLASSES])

        return { xs, labels }
    }

function getIndices(indices?: Uint32Array) {
    let shuffledIndex = 0
    return () => {
        if (indices) {
            shuffledIndex = (shuffledIndex + 1) % indices.length
            return indices[shuffledIndex]
        }
        console.warn('does not have test indices')
        return 0
    }
}

export async function getImagesFromTensors(examples: Batch) {
    const images: ImageData[] = []

    const numExamples = getImageCount(examples)
    for (let i = 0; i < numExamples; i++) {
        const image = await getImageData(i, examples)
        images.push(image)
    }
    return images
}

export async function loadMnistData() {
    const dataset = await loadCanvasImage()
    const [trainImages, trainLabels, testImages, testLabels] = splitDataset(
        dataset.images,
        dataset.labels
    )

    // Create shuffled indices into the train/test set for when we select a
    // random dataset element for training / validation.
    const trainIndices = tf.util.createShuffledIndices(NUM_TRAIN_ELEMENTS)
    const testIndices = tf.util.createShuffledIndices(NUM_TEST_ELEMENTS)

    return {
        nextTrainBatch: nextBatch(
            trainImages,
            trainLabels,
            getIndices(trainIndices)
        ),
        nextTestBatch: nextBatch(
            testImages,
            testLabels,
            getIndices(testIndices)
        ),
    }
}
