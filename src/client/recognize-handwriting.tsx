import React from 'react'
import * as tf from '@tensorflow/tfjs'
import { Fragment, useEffect, useRef, useState } from 'react'
import { MnistData } from './MnistData'
import { createModel, trainModel } from '../models/recognize-handwriting'
import Button from '@mui/material/Button'
import Toolbar from '@mui/material/Toolbar'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import { HandwritingTabs } from './HandwritingTabs'

function TitleSection() {
    return (
        <section>
            <h1>Handwritten digit recognition with CNNs</h1>
            <p>
                In this tutorial, we will build a TensorFlow.js model to
                recognize handwritten digits with a convolutional neural
                network. First, we will train the classifier by having it “look”
                at thousands of handwritten digit images and their labels. Then
                we will evaluate the classifier&apos;s accuracy using test data
                that the model has never seen.
            </p>
        </section>
    )
}

async function getExamples(data: MnistData) {
    // Get the examples
    const examples = data.nextTestBatch(20)
    const numExamples = examples.xs.shape[0]

    const results: ImageData[] = []
    // Create a canvas element to render each example
    const canvas = document.createElement('canvas')
    for (let i = 0; i < numExamples; i++) {
        const imageTensor = tf.tidy(() => {
            // Reshape the image to 28x28 px
            return examples.xs
                .slice([i, 0], [1, examples.xs.shape[1]])
                .reshape([28, 28, 1])
        })
        await tf.browser.toPixels(imageTensor as tf.Tensor2D, canvas)
        imageTensor.dispose()

        const imageData = canvas.getContext('2d')?.getImageData(0, 0, 28, 28)
        if (imageData) results.push(imageData)
    }
    return results
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

export const RecognizeHandwriting = (props: {
    setTitle: (title: string) => void
}) => {
    useEffect(() => {
        props.setTitle('Recognize handwriting')
    }, [props])

    const dataRef = useRef(new MnistData())

    const [showData, setShowData] = useState(false)
    const [runTraining, setTraining] = useState(false)
    const [examples, setExamples] = useState<ImageData[]>([])

    useEffect(() => {
        async function run() {
            const data = dataRef.current
            await data.load()
            const examples = await getExamples(data)
            setExamples([...examples])
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
        <Fragment>
            <Toolbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <TitleSection />
                            <Button
                                variant="contained"
                                fullWidth={false}
                                onClick={buttonHandler}
                            >
                                {buttonText}
                            </Button>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                height: 360,
                            }}
                        >
                            <HandwritingTabs examples={examples} />
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Fragment>
    )
}
