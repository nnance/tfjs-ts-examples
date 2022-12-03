import React from 'preact'
import { useEffect, useRef, useState } from 'preact/compat'
import { MnistData } from './MnistData'
import * as tf from '@tensorflow/tfjs'
// import * as tfvis from '@tensorflow/tfjs-vis'
import { createModel, trainModel } from '../models/recognize-handwriting'

function TitleSection() {
    return (
        <section className="title-area">
            <h1>TensorFlow.js: Examples</h1>
            <p className="subtitle">Handwritten digit recognition with CNNs</p>
        </section>
    )
}

async function showExamples(data: MnistData) {
    // Create a container in the visor
    // const surface = tfvis
    //     .visor()
    //     .surface({ name: 'Input Data Examples', tab: 'Input Data' })

    // Get the examples
    const examples = data.nextTestBatch(20)
    const numExamples = examples.xs.shape[0]

    // Create a canvas element to render each example
    for (let i = 0; i < numExamples; i++) {
        const imageTensor = tf.tidy(() => {
            // Reshape the image to 28x28 px
            return examples.xs
                .slice([i, 0], [1, examples.xs.shape[1]])
                .reshape([28, 28, 1])
        })
        const canvas = document.createElement('canvas')
        canvas.width = 28
        canvas.height = 28
        canvas.style.margin = '4px;'
        await tf.browser.toPixels(imageTensor as tf.Tensor2D, canvas)
        document.body.appendChild(canvas)
        // surface.drawArea.appendChild(canvas)

        imageTensor.dispose()
    }
}

// const classNames = [
//     'Zero',
//     'One',
//     'Two',
//     'Three',
//     'Four',
//     'Five',
//     'Six',
//     'Seven',
//     'Eight',
//     'Nine',
// ]

function doPrediction(
    model: tf.Sequential,
    data: MnistData,
    testDataSize = 500
) {
    const IMAGE_WIDTH = 28
    const IMAGE_HEIGHT = 28
    const testData = data.nextTestBatch(testDataSize)
    const testxs = testData.xs.reshape([
        testDataSize,
        IMAGE_WIDTH,
        IMAGE_HEIGHT,
        1,
    ])
    const labels = testData.labels.argMax(-1)
    const preds = (model.predict(testxs) as tf.Tensor<tf.Rank>).argMax(-1)

    testxs.dispose()
    return [preds, labels] as [tf.Tensor1D, tf.Tensor1D]
}

async function showAccuracy(model: tf.Sequential, data: MnistData) {
    const [preds, labels] = doPrediction(model, data)
    // const classAccuracy = await tfvis.metrics.perClassAccuracy(labels, preds)
    const container = { name: 'Accuracy', tab: 'Evaluation' }
    // tfvis.show.perClassAccuracy(container, classAccuracy, classNames)

    labels.dispose()
}

async function showConfusion(model: tf.Sequential, data: MnistData) {
    const [preds, labels] = doPrediction(model, data)
    // const confusionMatrix = await tfvis.metrics.confusionMatrix(labels, preds)
    const container = { name: 'Confusion Matrix', tab: 'Evaluation' }
    // tfvis.render.confusionMatrix(container, {
    //     values: confusionMatrix,
    //     tickLabels: classNames,
    // })

    labels.dispose()
}

export const App = () => {
    const dataRef = useRef(new MnistData())

    const [showData, setShowData] = useState(false)
    const [runTraining, setTraining] = useState(false)

    useEffect(() => {
        async function run() {
            const data = dataRef.current
            await data.load()
            await showExamples(data)
        }

        if (showData) {
            run()
        }
    }, [showData])

    useEffect(() => {
        async function run() {
            const data = dataRef.current

            const model = createModel()
            // tfvis.show.modelSummary(
            //     { name: 'Model Architecture', tab: 'Model' },
            //     model
            // )

            // const metrics = ['loss', 'val_loss', 'acc', 'val_acc']
            // const container = {
            //     name: 'Model Training',
            //     tab: 'Model',
            //     styles: { height: '1000px' },
            // }
            // const fitCallbacks = tfvis.show.fitCallbacks(container, metrics)

            await trainModel(model, data, 512, 5500, 1000)
            await showAccuracy(model, data)
            await showConfusion(model, data)
        }

        if (runTraining) {
            run()
        }
    }, [runTraining])

    const onLoadData = () => setShowData(true)
    const onTrain = () => setTraining(true)

    const buttonHandler = !showData ? onLoadData : onTrain
    const buttonText = !showData ? 'Load Data' : 'Train Model'

    return (
        <div className="example-container centered-container">
            <TitleSection />
            <div>
                <button onClick={buttonHandler}>{buttonText}</button>
            </div>
        </div>
    )
}
