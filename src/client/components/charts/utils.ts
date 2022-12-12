import { VisualizationSpec } from 'vega-embed'
import { Point2D, XYPlotData, XYPlotOptions } from './types'

export const defaultOpts: XYPlotOptions = {
    width: 'container',
    height: 'container',
    xLabel: 'x',
    yLabel: 'y',
    xType: 'quantitative',
    yType: 'quantitative',
    zoomToFit: false,
    fontSize: 11,
}

export const defaultSpec = (
    opts: XYPlotOptions
): Partial<VisualizationSpec> => ({
    width: opts.width,
    height: opts.height,
    padding: 0,
    autosize: {
        type: 'fit',
        contains: 'padding',
        resize: true,
    },
    config: {
        axis: {
            labelFontSize: opts.fontSize,
            titleFontSize: opts.fontSize,
        },
        text: { fontSize: opts.fontSize },
        legend: {
            labelFontSize: opts.fontSize,
            titleFontSize: opts.fontSize,
        },
    },
    encoding: {
        x: {
            field: 'x',
            type: opts.xType,
            title: opts.xLabel,
        },
        y: {
            field: 'y',
            type: opts.yType,
            title: opts.yLabel,
        },
        tooltip: [
            { field: 'series', type: 'ordinal' },
            { field: 'x', title: opts.xLabel, type: 'quantitative' },
            { field: 'y', title: opts.yLabel, type: 'quantitative' },
        ],
        color: {
            field: 'series',
            type: 'nominal',
            scale: {
                range: opts.seriesColors,
            },
        },
    },
})

export function normalizeData(data: XYPlotData) {
    const _series = data.series || []

    // Nest data if necessary before further processing
    const nestedValues = Array.isArray(data.values[0])
        ? (data.values as Point2D[][])
        : ([data.values] as Point2D[][])

    return nestedValues.reduce((prev, seriesData, i) => {
        const series = _series[i] || `Series ${i + 1}`
        const values = seriesData.map((v) => ({ series, ...v }))
        return [...prev, ...values]
    }, [])
}
