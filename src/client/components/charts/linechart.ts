import { VisualizationSpec } from 'vega-embed'
import { Point2D, XYPlotData, XYPlotOptions } from './types'
import { defaultOpts } from './utils'
import { UnitSpec } from 'vega-lite/src/spec'
import { Field, StringFieldDef } from 'vega-lite/src/channeldef'
import { Encoding } from 'vega-lite/src/encoding'

interface VLChartValue {
    x: number
    [key: string]: string | number
}

export function lineChart(
    data: XYPlotData,
    opts: XYPlotOptions
): VisualizationSpec {
    const options: XYPlotOptions = { ...defaultOpts, ...opts }
    // Nest data if necessary before further processing
    const _data = Array.isArray(data.values[0])
        ? (data.values as Point2D[][])
        : ([data.values] as Point2D[][])
    const numValues = _data[0].length

    // Create series names if none were passed in.
    const _series: string[] = data.series
        ? data.series
        : _data.map((_, i) => `Series ${i + 1}`)
    if (_series.length !== _data.length) {
        throw new Error(
            'Must have an equal number of series labels as there are data series'
        )
    }

    if (
        opts.seriesColors != null &&
        opts.seriesColors.length !== _data.length
    ) {
        throw new Error(
            'Must have an equal number of series colors as there are data series'
        )
    }

    const vlChartValues: VLChartValue[] = []
    for (let valueIdx = 0; valueIdx < numValues; valueIdx++) {
        const v: VLChartValue = {
            x: valueIdx,
        }

        _series.forEach((seriesName, seriesIdx) => {
            const seriesValue = _data[seriesIdx][valueIdx].y
            v[seriesName] = seriesValue
            v[`${seriesName}-name`] = seriesName
        })
        vlChartValues.push(v)
    }

    const yScale = () => {
        if (options.zoomToFit) {
            return { zero: false }
        } else if (options.yAxisDomain != null) {
            return { domain: options.yAxisDomain }
        }
        return undefined
    }

    const sharedEncoding: Encoding<Field> = {
        x: {
            field: 'x',
            type: options.xType,
            title: options.xLabel,
        },
        tooltip: [
            { field: 'x', type: 'quantitative' },
            ..._series.map<StringFieldDef<Field>>((seriesName) => {
                return {
                    field: seriesName,
                    type: 'quantitative',
                }
            }),
        ],
    }

    const lineLayers = _series.map<UnitSpec<Field>>((seriesName) => ({
        // data will be defined at the chart level.
        mark: { type: 'line', clip: true },
        encoding: {
            // Note: the encoding for 'x' is shared
            // Add a y encoding for this series
            y: {
                field: seriesName,
                type: options.yType,
                title: options.yLabel,
                scale: yScale(),
            },
            color: {
                field: `${seriesName}-name`,
                type: 'nominal',
                legend: { values: _series, title: null },
                scale: {
                    range: options.seriesColors,
                },
            },
        },
    }))

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
        data: { values: vlChartValues },
        encoding: sharedEncoding,
        layer: lineLayers,
    }
}
