import { VisualizationSpec } from 'vega-embed'
import { XYPlotData, XYPlotOptions } from './types'
import { defaultOpts, defaultSpec, normalizeData } from './utils'

export function lineChart(
    data: XYPlotData,
    opts: XYPlotOptions
): VisualizationSpec {
    const options: XYPlotOptions = { ...defaultOpts, ...opts }
    const values = normalizeData(data)

    const baseSpec = defaultSpec(options)
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
