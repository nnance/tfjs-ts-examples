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

/**
 * A class that fetches the sprited MNIST dataset and returns shuffled batches.
 *
 * NOTE: This will get much easier. For now, we do data fetching and
 * manipulation manually.
 */
export class MnistData {
    shuffledTrainIndex: number
    shuffledTestIndex: number
    datasetImages: Float32Array | undefined
    datasetLabels: Uint8Array | undefined
    trainIndices: Uint32Array | undefined
    testIndices: Uint32Array | undefined
    trainImages: Float32Array
    testImages: Float32Array
    trainLabels: Uint8Array
    testLabels: Uint8Array

    constructor() {
        this.shuffledTrainIndex = 0
        this.shuffledTestIndex = 0
        this.trainImages = new Float32Array()
        this.testImages = new Float32Array()
        this.trainLabels = new Uint8Array()
        this.testLabels = new Uint8Array()
    }

    async load() {
        // Make a request for the MNIST sprited image.
        const img = new Image()
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const imgRequest = new Promise<Float32Array>((resolve) => {
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
                this.datasetImages = new Float32Array(datasetBytesBuffer)

                resolve(this.datasetImages)
            }
            img.src = MNIST_IMAGES_SPRITE_PATH
        })

        const labelsRequest = fetch(MNIST_LABELS_PATH)
        const [imgResponse, labelsResponse] = await Promise.all([
            imgRequest,
            labelsRequest,
        ])

        this.datasetLabels = new Uint8Array(await labelsResponse.arrayBuffer())

        // Create shuffled indices into the train/test set for when we select a
        // random dataset element for training / validation.
        this.trainIndices = tf.util.createShuffledIndices(NUM_TRAIN_ELEMENTS)
        this.testIndices = tf.util.createShuffledIndices(NUM_TEST_ELEMENTS)

        // Slice the the images and labels into train and test sets.
        this.trainImages = imgResponse.slice(0, IMAGE_SIZE * NUM_TRAIN_ELEMENTS)
        this.testImages = imgResponse.slice(IMAGE_SIZE * NUM_TRAIN_ELEMENTS)
        this.trainLabels = this.datasetLabels.slice(
            0,
            NUM_CLASSES * NUM_TRAIN_ELEMENTS
        )
        this.testLabels = this.datasetLabels.slice(
            NUM_CLASSES * NUM_TRAIN_ELEMENTS
        )

        return this
    }

    nextTrainBatch(batchSize: number): Batch {
        return this.nextBatch(
            batchSize,
            [this.trainImages, this.trainLabels],
            () => {
                if (this.trainIndices) {
                    this.shuffledTrainIndex =
                        (this.shuffledTrainIndex + 1) % this.trainIndices.length
                    return this.trainIndices[this.shuffledTrainIndex]
                }
                console.warn('does not have train indices')
                return 0
            }
        )
    }

    nextTestBatch(batchSize: number): Batch {
        return this.nextBatch(
            batchSize,
            [this.testImages, this.testLabels],
            () => {
                if (this.testIndices) {
                    this.shuffledTestIndex =
                        (this.shuffledTestIndex + 1) % this.testIndices.length
                    return this.testIndices[this.shuffledTestIndex]
                }
                console.warn('does not have test indices')
                return 0
            }
        )
    }

    nextBatch(
        batchSize: number,
        data: [Float32Array, Uint8Array],
        index: () => number
    ) {
        const batchImagesArray = new Float32Array(batchSize * IMAGE_SIZE)
        const batchLabelsArray = new Uint8Array(batchSize * NUM_CLASSES)

        for (let i = 0; i < batchSize; i++) {
            const idx = index()

            const image = data[0].slice(
                idx * IMAGE_SIZE,
                idx * IMAGE_SIZE + IMAGE_SIZE
            )
            batchImagesArray.set(image, i * IMAGE_SIZE)

            const label = data[1].slice(
                idx * NUM_CLASSES,
                idx * NUM_CLASSES + NUM_CLASSES
            )
            batchLabelsArray.set(label, i * NUM_CLASSES)
        }

        const xs = tf.tensor2d(batchImagesArray, [batchSize, IMAGE_SIZE])
        const labels = tf.tensor2d(batchLabelsArray, [batchSize, NUM_CLASSES])

        return { xs, labels }
    }
}
