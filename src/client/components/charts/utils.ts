import { Point2D, XYPlotData } from './types'

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
