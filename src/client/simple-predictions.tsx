import { useEffect, useState } from 'preact/compat'
import { getData } from '../api/cars'
import { Point2D, scatterPlot } from './charts'

function TitleSection() {
    return (
        <section class="title-area">
            <h1>TensorFlow.js: Examples</h1>
            <p class="subtitle">Making Predictions from 2D Data</p>
        </section>
    )
}

export const App = () => {
    useEffect(() => {
        getData().then((cars) => {
            const data = cars.map<Point2D>((car) => [car.horsepower, car.mpg])
            scatterPlot({
                container: '#my_dataviz',
                data,
                options: {
                    xAxisDomain: [0, 250],
                    yAxisDomain: [0, 50],
                    xLabel: 'Horse Power',
                    yLabel: 'MPG',
                },
            })
        })
    }, [])

    return (
        <div class="example-container centered-container">
            <TitleSection />
            <div id="my_dataviz"></div>
        </div>
    )
}
