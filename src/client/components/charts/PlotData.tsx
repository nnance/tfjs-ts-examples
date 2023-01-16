import renderChart, { VisualizationSpec } from 'vega-embed'
import * as tf from '@tensorflow/tfjs'
import { Coefficients } from '../../../data/synthetic-curve'

export async function plotData(
    container: string | HTMLElement,
    xs: tf.Tensor,
    ys: tf.Tensor
) {
    const xvals = await xs.data()
    const yvals = await ys.data()

    const values = Array.from(yvals).map((y, i) => {
        return { x: xvals[i], y: yvals[i] }
    })

    const spec = {
        $schema: 'https://vega.github.io/schema/vega-lite/v2.json',
        width: 300,
        height: 300,
        data: { values: values },
        mark: 'point',
        encoding: {
            x: { field: 'x', type: 'quantitative' },
            y: { field: 'y', type: 'quantitative' },
        },
    } as VisualizationSpec

    return renderChart(container, spec, { actions: false })
}

export async function plotDataAndPredictions(
    container: string | HTMLElement,
    xs: tf.Tensor,
    ys: tf.Tensor,
    preds: tf.Tensor
) {
    const xvals = await xs.data()
    const yvals = await ys.data()
    const predVals = await preds.data()

    const values = Array.from(yvals).map((y, i) => {
        return { x: xvals[i], y: yvals[i], pred: predVals[i] }
    })

    const spec = {
        $schema: 'https://vega.github.io/schema/vega-lite/v2.json',
        width: 300,
        height: 300,
        data: { values: values },
        layer: [
            {
                mark: 'point',
                encoding: {
                    x: { field: 'x', type: 'quantitative' },
                    y: { field: 'y', type: 'quantitative' },
                },
            },
            {
                mark: 'line',
                encoding: {
                    x: { field: 'x', type: 'quantitative' },
                    y: { field: 'pred', type: 'quantitative' },
                    color: { value: 'tomato' },
                },
            },
        ],
    } as VisualizationSpec

    return renderChart(container, spec, { actions: false })
}

export function renderCoefficients(container: string, coeff: Coefficients) {
    const html = `<span>a=${coeff.a.toFixed(3)}, b=${coeff.b.toFixed(
        3
    )}, c=${coeff.c.toFixed(3)},  d=${coeff.d.toFixed(3)}</span>`

    const el = document.querySelector(container)
    if (el) el.innerHTML = html
}
