import * as d3 from 'd3'

export type Point2D = [number, number]

type ScatterPlotProps = {
    container: HTMLElement | string
    data: Point2D[]
    options: {
        xAxisDomain: [number, number]
        yAxisDomain: [number, number]
        xLabel?: string
        yLabel?: string
        width?: number
        height?: number
        margin?: Partial<{
            top: number
            right: number
            bottom: number
            left: number
        }>
    }
}
export function scatterPlot(props: ScatterPlotProps) {
    const { container, data, options } = props

    // set the dimensions and margins of the graph
    const margin = {
            top: options.margin?.top || 10,
            right: options.margin?.right || 30,
            bottom: options.margin?.bottom || 30,
            left: options.margin?.left || 60,
        },
        width = options.width || 460 - margin.left - margin.right,
        height = options.height || 400 - margin.top - margin.bottom

    // append the svg object to the body of the page
    const svg = d3
        .select(container as string)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    // Add X axis
    const x = d3.scaleLinear().domain(options.xAxisDomain).range([0, width])
    svg.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x))
    // Add X axis label:
    if (options.xLabel) {
        svg.append('text')
            .attr('text-anchor', 'end')
            .attr('x', width / 2)
            .attr('y', height + margin.top + 20)
            .text(options?.xLabel)
    }

    // Add Y axis
    const y = d3.scaleLinear().domain(options.yAxisDomain).range([height, 0])
    svg.append('g').call(d3.axisLeft(y))

    // Add dots
    svg.append('g')
        .selectAll('dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', (point) => x(point[0]))
        .attr('cy', (point) => y(point[1]))
        .attr('r', 1.5)
        .style('fill', '#69b3a2')
    // Y axis label:
    if (options.yLabel) {
        svg.append('text')
            .attr('text-anchor', 'end')
            .attr('transform', 'rotate(-90)')
            .attr('y', -margin.left + 30)
            .attr('x', -(margin.top + height) / 2)
            .text(options?.yLabel)
    }
}
