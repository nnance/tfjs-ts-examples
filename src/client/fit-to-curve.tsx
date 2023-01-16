import * as React from 'react'
import { Panel } from './components/Panel'
import { Page } from './components/Page'
import { TabContainer } from './components/TabContainer'
import { generateData } from '../data/synthetic-curve'
import { plotData } from './components/charts/PlotData'

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

function InputTab({ trainingData }: { trainingData: TrainingData }) {
    const chartRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        if (chartRef.current) {
            // Plot original data
            plotData(chartRef.current, trainingData.xs, trainingData.ys)
        }
    }, [chartRef, trainingData.xs, trainingData.ys])

    return <div ref={chartRef}></div>
}

type TrainingData = ReturnType<typeof generateData>
export const FitToCurve = (props: { setTitle: (title: string) => void }) => {
    React.useEffect(() => {
        props.setTitle('Fit To Curve')
    }, [props])

    const [trainingData] = React.useState(() => {
        const trueCoefficients = { a: -0.8, b: -0.2, c: 0.9, d: 0.5 }
        return generateData(100, trueCoefficients)
    })

    const tabs = [
        {
            label: 'Input',
            component: () => <InputTab trainingData={trainingData} />,
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
