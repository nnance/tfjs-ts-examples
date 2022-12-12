import { VisualizationSpec } from 'vega-embed'
import { XYPlotData, XYPlotOptions } from './types'
import { defaultOpts, normalizeData } from './utils'

export function scatterPlot(
    data: XYPlotData,
    opts: XYPlotOptions
): VisualizationSpec {
    const options: XYPlotOptions = { ...defaultOpts, ...opts }
    const values = normalizeData(data)

    console.dir(options)

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
            type: 'point',
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
