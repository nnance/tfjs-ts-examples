import * as React from 'react'
import { Panel } from './components/Panel'
import { Page } from './components/Page'
import { TabContainer } from './components/TabContainer'
import { generateData } from '../data/synthetic-curve'
import { plotData, plotDataAndPredictions } from './components/charts/PlotData'
import { predict, train } from '../models/fit-to-curve'

const numIterations = 75

function TitleSection() {
    return (
        <section>
            <h1>Fitting a curve to synthetic data</h1>
            <p>Train a model to learn the coefficients of a cubic function.</p>
            <p>
                This model learns to approximate the coefficients of a cubic
                function used to generate the points shown below on the left.
            </p>
        </section>
    )
}

type TrainingData = ReturnType<typeof generateData>

function InputTab({ trainingData }: { trainingData?: TrainingData }) {
    const chartRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        if (chartRef.current && trainingData) {
            // Plot original data
            plotData(chartRef.current, trainingData.xs, trainingData.ys)
        }
    }, [chartRef, trainingData])

    return <div ref={chartRef}></div>
}

function ResultsTab({ trainingData }: { trainingData?: TrainingData }) {
    const chartRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        if (chartRef.current && trainingData) {
            const predictions = predict(trainingData.xs)
            plotDataAndPredictions(
                chartRef.current,
                trainingData.xs,
                trainingData.ys,
                predictions
            )
        }
    })

    return <div ref={chartRef}></div>
}

export const FitToCurve = (props: { setTitle: (title: string) => void }) => {
    React.useEffect(() => {
        props.setTitle('Fit To Curve')
    }, [props])

    const [trainingData, setTrainingData] = React.useState<TrainingData>()

    React.useEffect(() => {
        async function runTraining() {
            const trueCoefficients = { a: -0.8, b: -0.2, c: 0.9, d: 0.5 }
            const trainingData = generateData(100, trueCoefficients)
            setTrainingData(trainingData)

            // Train the model!
            await train(trainingData.xs, trainingData.ys, numIterations)
        }
        runTraining()
    }, [])

    const tabs = [
        {
            label: 'Input',
            component: () => <InputTab trainingData={trainingData} />,
        },
        {
            label: 'Results',
            component: () => <ResultsTab trainingData={trainingData} />,
        },
    ]

    return (
        <Page>
            <Panel>
                <TitleSection />
            </Panel>
            <Panel>
                <TabContainer tabs={tabs} />
            </Panel>
        </Page>
    )
}
