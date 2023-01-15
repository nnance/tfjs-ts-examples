import React from 'react'
import { Fragment, useEffect, useState } from 'react'
import { Batch, loadMnistData } from '../data/mnist'
import Button from '@mui/material/Button'
import Toolbar from '@mui/material/Toolbar'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import { TabContainer } from './components/TabContainer'
import {
    loadTrainedModel,
    PredictionResults,
    TrainedModel,
} from '../models/recognize-handwriting'
import { InputTab } from './components/handwriting/InputTab'
import { ModelTab } from './components/handwriting/ModelTab'
import { PredictionTab } from './components/handwriting/PredictionTab'

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

export const RecognizeHandwriting = (props: {
    setTitle: (title: string) => void
}) => {
    useEffect(() => {
        props.setTitle('Recognize handwriting')
    }, [props])

    const [model, setModel] = useState<TrainedModel>()
    const [runEvaluation, setRunEvaluation] = useState(false)
    const [testData, setTestData] = useState<Batch>()
    const [results, setResults] = useState<PredictionResults>()

    useEffect(() => {
        loadMnistData().then((data) => {
            const examples = data.nextTestBatch(20)
            setTestData(examples)
        })
    }, [])

    useEffect(() => {
        loadTrainedModel().then(setModel)
    }, [])

    useEffect(() => {
        if (!model || !testData || !runEvaluation) return
        const results = model.predict(testData)
        setResults(results)
        setRunEvaluation(false)
    }, [runEvaluation, model, testData])

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
                                onClick={() => setRunEvaluation(true)}
                                disabled={runEvaluation}
                            >
                                {runEvaluation
                                    ? 'Training...'
                                    : 'Evaluate Model'}
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
                            <TabContainer
                                tabs={[
                                    {
                                        label: 'Input',
                                        component: () => (
                                            <InputTab testData={testData} />
                                        ),
                                    },
                                    {
                                        label: 'Model',
                                        component: () => (
                                            <ModelTab model={model} />
                                        ),
                                    },
                                    {
                                        label: 'Evaluation',
                                        component: () => (
                                            <PredictionTab
                                                testData={testData}
                                                results={results}
                                            />
                                        ),
                                    },
                                ]}
                            />
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Fragment>
    )
}
