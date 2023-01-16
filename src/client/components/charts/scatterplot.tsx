import * as React from 'react'
import { VisualizationSpec } from 'vega-embed'
import { Chart } from './Chart'
import { ChartSpec, XYPlotData, XYPlotOptions } from './types'
import { defaultOpts, defaultSpec, normalizeData } from './utils'

export function scatterPlot(
    data: XYPlotData,
    opts: XYPlotOptions
): VisualizationSpec {
    const values = normalizeData(data)

    const baseSpec = defaultSpec({ ...defaultOpts, ...opts })
    const spec: Partial<VisualizationSpec> = {
        data: { values },
        mark: {
            type: 'point',
            clip: true,
            tooltip: { content: 'data' },
        },
    }

    return { ...baseSpec, ...spec } as VisualizationSpec
}

type ScatterPlotProps = { spec?: ChartSpec }
export function ScatterPlot({ spec }: ScatterPlotProps) {
    const visSpec = spec ? scatterPlot(spec.data, spec.options) : undefined
    return <Chart spec={visSpec} />
}
