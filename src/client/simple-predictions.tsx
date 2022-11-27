import { useEffect, useState } from 'preact/compat'
import * as d3 from 'd3'
import { Point2D, scatterPlot } from './charts'

function TitleSection() {
    return (
        <section class="title-area">
            <h1>TensorFlow.js: Examples</h1>
            <p class="subtitle">Making Predictions from 2D Data</p>
        </section>
    )
}

type Car = {
    Name: string
    Miles_per_Gallon: number
    Cylinders: number
    Displacement: number
    Horsepower: number
    Weight_in_lbs: number
    Acceleration: number
    Year: string
    Origin: string
}

async function getData() {
    const carsDataResponse = await fetch(
        'https://storage.googleapis.com/tfjs-tutorials/carsData.json'
    )
    const carsData: Car[] = await carsDataResponse.json()
    const cleaned = carsData
        .map((car) => ({
            mpg: car.Miles_per_Gallon,
            horsepower: car.Horsepower,
        }))
        .filter((car) => car.mpg != null && car.horsepower != null)

    return cleaned
}

export const App = () => {
    const [results, setResults] = useState('')

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
