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
        d3.csv(
            'https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/2_TwoNum.csv'
        ).then((data) => {
            // Add X axis
            var x = d3.scaleLinear().domain([0, 4000]).range([0, width])
            svg.append('g')
                .attr('transform', 'translate(0,' + height + ')')
                .call(d3.axisBottom(x))

            // Add Y axis
            var y = d3.scaleLinear().domain([0, 500000]).range([height, 0])
            svg.append('g').call(d3.axisLeft(y))

            // Add dots
            svg.append('g')
                .selectAll('dot')
                .data(data)
                .enter()
                .append('circle')
                .attr('cx', ({ GrLivArea }) =>
                    x(GrLivArea ? Number.parseInt(GrLivArea) : 0)
                )
                .attr('cy', ({ SalePrice }) =>
                    y(SalePrice ? Number.parseInt(SalePrice) : 0)
                )
                .attr('r', 1.5)
                .style('fill', '#69b3a2')
        })
    }, [])

    return (
        <div class="example-container centered-container">
            <TitleSection />
            <div id="my_dataviz"></div>
        </div>
    )
}
