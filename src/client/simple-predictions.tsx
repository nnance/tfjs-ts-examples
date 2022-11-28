import { useEffect } from 'preact/compat'
import { getPredictions } from '../server'
import { Point2D, scatterPlot } from './charts'

function TitleSection() {
    return (
        <section class="title-area">
            <h1>TensorFlow.js: Examples</h1>
            <p class="subtitle">Making Predictions from 2D Data</p>
        </section>
    )
}

type PredictionResults = ReturnType<typeof getPredictions>

export const App = () => {
    useEffect(() => {
        async function getDataWithPredictions() {
            const res = await fetch(
                'http://localhost:8080/simple-predictions/test'
            )
            const { originalPoints, predictedPoints } =
                (await res.json()) as PredictionResults

            const origTuples = originalPoints.map<Point2D>(({ x, y }) => [x, y])
            const predTuples = predictedPoints.map<Point2D>(({ x, y }) => [
                x,
                y,
            ])

            scatterPlot({
                container: '#my_dataviz',
                data: [origTuples, predTuples],
                options: {
                    xAxisDomain: [0, 250],
                    yAxisDomain: [0, 50],
                    xLabel: 'Horse Power',
                    yLabel: 'MPG',
                },
            })
        }

        getDataWithPredictions()
    }, [])

    return (
        <div class="example-container centered-container">
            <TitleSection />
            <div id="my_dataviz"></div>
        </div>
    )
}
