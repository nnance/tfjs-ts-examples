import * as React from 'react'
import { Title } from './components/Title'
import { loadTrainedModel } from '../models/predict-2d-data'
import { getData } from '../data/cars'
import { Page } from './components/Page'
import { Panel } from './components/Panel'
import { ChartSpec } from './components/charts/types'
import { ScatterPlot } from './components/charts/scatterplot'

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

async function getDataWithPredictions() {
    const model = await loadTrainedModel()
    const data = await getData()
    const predictions = model.predict(data)

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

const carPerformanceSpec = (data: EnrichedPredictionResults): ChartSpec => {
    const { originalPoints, predictedPoints } = data
    const orig = originalPoints.map((p) => ({ x: p.horsepower, y: p.mpg }))
    const predicted = predictedPoints.map((p) => ({
        x: p.horsepower,
        y: p.mpg,
    }))
    return {
        data: { values: [orig, predicted], series: ['original', 'predicted'] },
        options: { xLabel: 'Horsepower', yLabel: 'MPG' },
    }
}

export const Predict2D = (props: { setTitle: (title: string) => void }) => {
    const [spec, setSpec] = React.useState<ChartSpec>()

    React.useEffect(() => {
        props.setTitle('Predict 2D Data')
    }, [props])

    React.useEffect(() => {
        getDataWithPredictions().then((data) => {
            const spec = carPerformanceSpec(data)
            setSpec(spec)
        })
    }, [])

    return (
        <Page>
            <Panel>
                <TitleSection />
            </Panel>
            <Panel height={360}>
                <Title>MPG by Horsepower</Title>
                <ScatterPlot spec={spec} />
            </Panel>
        </Page>
    )
}
