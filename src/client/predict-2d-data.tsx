import { Container, Grid, Paper } from '@mui/material'
import Toolbar from '@mui/material/Toolbar'
import { Fragment } from 'preact'
import React from 'react'
import { useEffect } from 'react'
import { getPredictions } from '../server'
import { VisualizationSpec } from 'vega-embed'
import { Title } from './components/Title'
import { scatterPlot } from './components/charts/scatterplot'
import { Chart } from './components/Chart'
import { useState } from 'preact/hooks'

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

type PredictionResults = ReturnType<typeof getPredictions>
type EnrichedPrediction = {
    type: string
    mpg: number
    horsepower: number
}
type EnrichedPredictionResults = {
    originalPoints: EnrichedPrediction[]
    predictedPoints: EnrichedPrediction[]
}

async function getDataWithPredictions() {
    const res = await fetch('http://localhost:8080/simple-predictions/test')
    const data = (await res.json()) as PredictionResults

    const originalPoints = data.originalPoints.map<EnrichedPrediction>((d) => {
        return { ...d, type: 'original' }
    })

    const predictedPoints = data.predictedPoints.map<EnrichedPrediction>(
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
    const [spec, setSpec] = useState<VisualizationSpec>()

    useEffect(() => {
        props.setTitle('Fit To Curve')
    }, [props])

    useEffect(() => {
        getDataWithPredictions().then((data) => {
            const spec = carPerformanceSpec(data)
            setSpec(spec)
        })
    }, [])

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
        </Fragment>
    )
}
