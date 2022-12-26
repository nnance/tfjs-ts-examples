import { Paper } from '@mui/material'
import React from 'react'
import { VisualizationSpec } from 'vega-embed'
import { TrainedModel } from '../../../models/recognize-handwriting'
import { Chart } from '../Chart'
import { lineChart } from '../charts/linechart'
import { ModelSummary } from '../ModelSummary'
import { Title } from '../Title'

export type BatchResult = {
    batchNumber: number
    acc: number
    loss: number
}

interface ModelTabProps {
    model: TrainedModel | undefined
}

export function ModelTab(props: ModelTabProps) {
    const { model } = props

    const [batchResults, setBatchResults] = React.useState<BatchResult[]>([])
    const [spec, setSpec] = React.useState<VisualizationSpec>()
    const [accSpec, setAccSpec] = React.useState<VisualizationSpec>()

    React.useEffect(() => {
        const values = batchResults.map((batch) => ({
            x: batch.batchNumber,
            y: batch.loss,
        }))
        const series = ['loss']
        const data = { values, series }
        setSpec(
            lineChart(data, {
                xLabel: 'Batch',
                yLabel: 'Value',
            })
        )
    }, [batchResults, setSpec])

    React.useEffect(() => {
        const values = batchResults.map((batch) => ({
            x: batch.batchNumber,
            y: batch.acc,
        }))
        const series = ['acc']
        const data = { values, series }
        setAccSpec(
            lineChart(data, {
                xLabel: 'Batch',
                yLabel: 'Value',
            })
        )
    }, [batchResults, setAccSpec])

    return (
        <React.Fragment>
            <Paper
                sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {model && (
                    <React.Fragment>
                        <Title>Model Summary</Title>
                        <ModelSummary model={model} />
                    </React.Fragment>
                )}
            </Paper>
            {batchResults.length > 0 && (
                <Paper
                    sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Title>onBatchEnd</Title>
                    <Chart spec={spec} />
                    <Chart spec={accSpec} />
                </Paper>
            )}
        </React.Fragment>
    )
}
