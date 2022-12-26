import React from 'react'
import { Fragment, useEffect, useState } from 'react'
import { Batch, MnistData } from '../data/mnist'
import Button from '@mui/material/Button'
import Toolbar from '@mui/material/Toolbar'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import { HandwritingTabs } from './components/HandwritingTabs'
import { loadTrainedModel, TrainedModel } from '../models/recognize-handwriting'

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

/*
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

async function showAccuracy(model: tf.LayersModel, batch: Batch) {
    const [preds, labels] = doPrediction(model, batch)
    const classAccuracy = await tfvis.metrics.perClassAccuracy(labels, preds)
    const container = { name: 'Accuracy', tab: 'Evaluation' }
    tfvis.show.perClassAccuracy(container, classAccuracy, classNames)

    labels.dispose()
}

async function showConfusion(model: tf.Sequential, data: MnistData) {
    const [preds, labels] = doPrediction(model, data)
    const confusionMatrix = await tfvis.metrics.confusionMatrix(labels, preds)
    const container = { name: 'Confusion Matrix', tab: 'Evaluation' }
    tfvis.render.confusionMatrix(container, {
        values: confusionMatrix,
        tickLabels: classNames,
    })

    labels.dispose()
}

async function fetchTrainingResults(model: tf.LayersModel) {
    const results: BatchResult[] = []
    let currentEpoch = 0
    const batchSize = 11

    function onBatchEnd(batch: number, logs?: tf.Logs) {
        if (!logs) return

        const batchNumber = currentEpoch * batchSize + batch
        console.log(`batch: ${batchNumber} acc: ${logs?.acc}`)
        results.push({
            batchNumber,
            acc: logs?.acc,
            loss: logs?.loss,
        })
    }

    function onEpochEnd(epoch: number) {
        currentEpoch = epoch + 1
    }

    await trainModel(model, data, 512, 5500, 1000, {
        onBatchEnd,
        onEpochEnd,
    })

    return results
}
*/

// TODO: create tabs in this component and push them to the generic Tabs component
// TODO: load the model training results and display them in the tabs

export const RecognizeHandwriting = (props: {
    setTitle: (title: string) => void
}) => {
    useEffect(() => {
        props.setTitle('Recognize handwriting')
    }, [props])

    const [model, setModel] = useState<TrainedModel>()
    // TODO: push test state into the HandwritingTabs component
    const [runTest, setTest] = useState(false)
    const [examples, setExamples] = useState<Batch>()

    useEffect(() => {
        const data = new MnistData()
        data.load().then(() => {
            const examples = data.nextTestBatch(20)
            setExamples(examples)
        })
    }, [])

    useEffect(() => {
        loadTrainedModel().then(setModel)
    }, [])

    useEffect(() => {
        async function run() {
            // const trainingResults = await fetchTrainingResults(model)
            // setBatchResults(trainingResults)
            // setTest(false)
            // const metrics = ['loss', 'val_loss', 'acc', 'val_acc']
            // await showAccuracy(model, examples as Batch)
            // await showConfusion(model, data)
        }

        if (runTest) {
            run()
        }
    }, [runTest, model, examples, setTest])

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
                                onClick={() => setTest(true)}
                                disabled={runTest}
                            >
                                {runTest ? 'Training...' : 'Test Model'}
                            </Button>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                minHeight: 360,
                            }}
                        >
                            <HandwritingTabs
                                testData={examples}
                                model={model}
                            />
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Fragment>
    )
}
