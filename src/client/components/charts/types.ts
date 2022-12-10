/**
 * Datum format for scatter and line plots
 */
export interface Point2D {
    x: number
    y: number
}

/**
 * Common visualisation options for '.render' functions.
 */
export interface VisOptions {
    /**
     * Width of chart in px
     */
    width?: number
    /**
     * Height of chart in px
     */
    height?: number
    /**
     * Label for xAxis
     */
    xLabel?: string
    /**
     * Label for yAxis
     */
    yLabel?: string
    /**
     * Fontsize in px
     */
    fontSize?: number
    /**
     * Will be set automatically
     */
    xType?: 'quantitative' | 'ordinal' | 'nominal'
    /**
     * Will be set automatically
     */
    yType?: 'quantitative' | 'ordinal' | 'nominal'
}

/**
 * Options for XY plots
 */
export interface XYPlotOptions extends VisOptions {
    /**
     * domain of the x axis. Overriden by zoomToFit
     */
    xAxisDomain?: [number, number]
    /**
     * domain of the y axis. Overriden by zoomToFit
     */
    yAxisDomain?: [number, number]
    /**
     * Set the chart bounds to just fit the data. This may modify the axis scales
     * but allows fitting more data into view.
     */
    zoomToFit?: boolean
    /**
     * Colors to for each series plotted. An array of valid CSS color strings.
     */
    seriesColors?: string[]
}

/**
 * Data format for XY plots
 */
export interface XYPlotData {
    /**
     * An array (or nested array) of {x, y} tuples.
     */
    values: Point2D[][] | Point2D[]
    /**
     * Series names/labels
     */
    series?: string[]
}
