import React from 'react'
import * as tf from '@tensorflow/tfjs'
import { Container, Grid, Paper } from '@mui/material'
import Toolbar from '@mui/material/Toolbar'
import { VisualizationSpec } from 'vega-embed'
import { Title } from './components/Title'
import { scatterPlot } from './components/charts/scatterplot'
import { Chart } from './components/Chart'
import {
    convertToTensor,
    loadTrainedModel,
    testModel,
} from '../models/predict-2d-data'
import { CarPerformance, getData } from '../data/cars'

function TitleSection() {
    return (
        <section>
            <h1>Making predictions from 2d data</h1>
            <p>
                In this tutorial you will train a model to make predictions from
                numerical data describing a set of cars.
            </p>
            <p>
                This exercise will demonstrate steps common to training many
                different kinds of models, but will use a small dataset and a
                simple (shallow) model. The primary aim is to help you get
                familiar with the basic terminology, concepts and syntax around
                training models with TensorFlow.js and provide a stepping stone
                for further exploration and learning.
            </p>
        </section>
    )
}

type EnrichedPrediction = {
    type: string
    mpg: number
    horsepower: number
}
type EnrichedPredictionResults = {
    originalPoints: EnrichedPrediction[]
    predictedPoints: EnrichedPrediction[]
}

export function getPredictions(
    model: tf.LayersModel,
    originalPoints: CarPerformance[]
) {
    const tensorData = convertToTensor(originalPoints)
    const predications = testModel(model, tensorData)

    const predictedPoints = predications.map((d) => ({
        horsepower: d.x,
        mpg: d.y,
    }))

    return { predictedPoints, originalPoints }
}

async function getDataWithPredictions() {
    const model = await loadTrainedModel()
    const data = await getData()
    const predictions = getPredictions(model, data)

    const originalPoints = predictions.originalPoints.map<EnrichedPrediction>(
        (d) => {
            return { ...d, type: 'original' }
        }
    )

    const predictedPoints = predictions.predictedPoints.map<EnrichedPrediction>(
        (d) => {
            return { ...d, type: 'predicted' }
        }
    )

    return { originalPoints, predictedPoints }
}

const carPerformanceSpec = (data: EnrichedPredictionResults) => {
    const { originalPoints, predictedPoints } = data
    const orig = originalPoints.map((p) => ({ x: p.horsepower, y: p.mpg }))
    const predicted = predictedPoints.map((p) => ({
        x: p.horsepower,
        y: p.mpg,
    }))
    return scatterPlot(
        { values: [orig, predicted], series: ['original', 'predicted'] },
        { xLabel: 'Horsepower', yLabel: 'MPG' }
    )
}

export const FitToCurve = (props: { setTitle: (title: string) => void }) => {
    const [spec, setSpec] = React.useState<VisualizationSpec>()

    React.useEffect(() => {
        props.setTitle('Fit To Curve')
    }, [props])

    React.useEffect(() => {
        getDataWithPredictions().then((data) => {
            const spec = carPerformanceSpec(data)
            setSpec(spec)
        })
    }, [])

    return (
        <React.Fragment>
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
                            <Title>MPG by Horsepower</Title>
                            <Chart spec={spec} />
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </React.Fragment>
    )
}
