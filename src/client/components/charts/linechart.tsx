import * as React from 'react'
import { VisualizationSpec } from 'vega-embed'
import { Chart } from './Chart'
import { ChartSpec, XYPlotData, XYPlotOptions } from './types'
import { defaultOpts, defaultSpec, normalizeData } from './utils'

export function lineChart(
    data: XYPlotData,
    opts: XYPlotOptions
): VisualizationSpec {
    const values = normalizeData(data)

    const baseSpec = defaultSpec({ ...defaultOpts, ...opts })
    const spec: Partial<VisualizationSpec> = {
        data: { values },
        mark: {
            type: 'line',
            clip: true,
            tooltip: { content: 'data' },
        },
    }

    return { ...baseSpec, ...spec } as VisualizationSpec
}

export function LineChart({ spec }: { spec?: ChartSpec }) {
    const visSpec = spec ? lineChart(spec.data, spec.options) : undefined
    return <Chart spec={visSpec} />
}
