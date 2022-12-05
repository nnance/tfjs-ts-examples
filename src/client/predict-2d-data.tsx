import { Container, Grid, Paper } from '@mui/material'
import Toolbar from '@mui/material/Toolbar'
import { Fragment } from 'preact'
import React from 'react'
import { useEffect } from 'react'
import { getPredictions } from '../server'
import vegaEmbed from 'vega-embed'
import { Title } from './components/Title'

function TitleSection() {
    return (
        <section>
            <p>Making Predictions from 2D Data</p>
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

const renderCarPerformanceChart =
    (id: string) => (data: EnrichedPredictionResults) => {
        const { originalPoints, predictedPoints } = data
        vegaEmbed(id, {
            $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
            width: 'container',
            height: 'container',
            data: {
                values: [...originalPoints, ...predictedPoints],
            },
            mark: 'circle',
            encoding: {
                x: {
                    field: 'horsepower',
                    type: 'quantitative',
                    title: 'Horsepower',
                },
                y: { field: 'mpg', type: 'quantitative', title: 'MPG' },
                color: { field: 'type', type: 'nominal', title: 'Type' },
            },
        })
    }

export const FitToCurve = (props: { setTitle: (title: string) => void }) => {
    useEffect(() => {
        props.setTitle('Fit To Curve')
    }, [props])

    useEffect(() => {
        getDataWithPredictions().then(renderCarPerformanceChart('#my_dataviz'))
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
                            <div
                                id="my_dataviz"
                                style={{ width: '100%', height: '100%' }}
                            ></div>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Fragment>
    )
}
