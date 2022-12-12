import { VisualizationSpec } from 'vega-embed'
import { XYPlotData, XYPlotOptions } from './types'
import { defaultOpts, normalizeData } from './utils'

export function lineChart(
    data: XYPlotData,
    opts: XYPlotOptions
): VisualizationSpec {
    const options: XYPlotOptions = { ...defaultOpts, ...opts }
    const values = normalizeData(data)

    return {
        width: options.width,
        height: options.height,
        padding: 0,
        autosize: {
            type: 'fit',
            contains: 'padding',
            resize: true,
        },
        config: {
            axis: {
                labelFontSize: options.fontSize,
                titleFontSize: options.fontSize,
            },
            text: { fontSize: options.fontSize },
            legend: {
                labelFontSize: options.fontSize,
                titleFontSize: options.fontSize,
            },
        },
        data: { values },
        mark: {
            type: 'line',
            clip: true,
            tooltip: { content: 'data' },
        },
        encoding: {
            x: {
                field: 'x',
                type: options.xType,
                title: options.xLabel,
            },
            y: {
                field: 'y',
                type: options.yType,
                title: options.yLabel,
            },
            tooltip: [
                { field: 'series', type: 'ordinal' },
                { field: 'x', title: options.xLabel, type: 'quantitative' },
                { field: 'y', title: options.yLabel, type: 'quantitative' },
            ],
            color: {
                field: 'series',
                type: 'nominal',
                scale: {
                    range: options.seriesColors,
                },
            },
        },
    }
}
