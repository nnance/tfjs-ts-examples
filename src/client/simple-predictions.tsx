import { useEffect, useState } from 'preact/compat'
import * as d3 from 'd3'

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
        // set the dimensions and margins of the graph
        var margin = { top: 10, right: 30, bottom: 30, left: 60 },
            width = 460 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom

        // append the svg object to the body of the page
        var svg = d3
            .select('#my_dataviz')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr(
                'transform',
                'translate(' + margin.left + ',' + margin.top + ')'
            )

        //Read the data
        getData().then((data) => {
            // Add X axis
            var x = d3.scaleLinear().domain([0, 250]).range([0, width])
            svg.append('g')
                .attr('transform', 'translate(0,' + height + ')')
                .call(d3.axisBottom(x))
            // Add X axis label:
            svg.append('text')
                .attr('text-anchor', 'end')
                .attr('x', width / 2)
                .attr('y', height + margin.top + 20)
                .text('Horse Power')

            // Add Y axis
            var y = d3.scaleLinear().domain([0, 50]).range([height, 0])
            svg.append('g').call(d3.axisLeft(y))

            // Add dots
            svg.append('g')
                .selectAll('dot')
                .data(data)
                .enter()
                .append('circle')
                .attr('cx', ({ horsepower }) => x(horsepower))
                .attr('cy', ({ mpg }) => y(mpg))
                .attr('r', 1.5)
                .style('fill', '#69b3a2')
            // Y axis label:
            svg.append('text')
                .attr('text-anchor', 'end')
                .attr('transform', 'rotate(-90)')
                .attr('y', -margin.left + 30)
                .attr('x', -(margin.top + height) / 2)
                .text('MPG')
        })
    }, [])

    return (
        <div class="example-container centered-container">
            <TitleSection />
            <div id="my_dataviz"></div>
        </div>
    )
}
