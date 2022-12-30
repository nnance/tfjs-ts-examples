import { Paper } from '@mui/material'
import React from 'react'
import { VisualizationSpec } from 'vega-embed'
import {
    loadTrainingResults,
    TrainedModel,
} from '../../../models/recognize-handwriting'
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
    model?: TrainedModel
    batchResults?: BatchResult[]
}

type TrainingResults = Awaited<ReturnType<typeof loadTrainingResults>>

const getBatchLossResults = (results: TrainingResults) =>
    results.batchHistory.map((batch, x) => ({
        x,
        y: batch.loss,
    }))

const getBatchAccResults = (results: TrainingResults) =>
    results.batchHistory.map((batch, x) => ({
        x,
        y: batch.acc,
    }))

const getEpochLossResults = (results: TrainingResults) => [
    results.history.loss.map((y, x) => ({ x, y })),
    results.history.val_loss.map((y, x) => ({ x, y })),
]

const getEpochAccResults = (results: TrainingResults) => [
    results.history.acc.map((y, x) => ({ x, y })),
    results.history.val_acc.map((y, x) => ({ x, y })),
]

// transform batch results to line chart
const batchLossChart = (values: ReturnType<typeof getBatchLossResults>) =>
    lineChart(
        { values, series: ['loss'] },
        {
            xLabel: 'Batch',
            yLabel: 'Value',
            height: 300,
        }
    )

const batchAccChart = (values: ReturnType<typeof getBatchAccResults>) =>
    lineChart(
        { values, series: ['acc'] },
        {
            xLabel: 'Batch',
            yLabel: 'Value',
            height: 300,
        }
    )

const epochLossChart = (values: ReturnType<typeof getEpochLossResults>) =>
    lineChart(
        { values, series: ['loss', 'val_loss'] },
        {
            xLabel: 'Epoch',
            yLabel: 'Value',
            height: 300,
        }
    )

const epochAccChart = (values: ReturnType<typeof getEpochAccResults>) =>
    lineChart(
        { values, series: ['acc', 'val_acc'] },
        {
            xLabel: 'Epoch',
            yLabel: 'Value',
            height: 300,
        }
    )

export function ModelTab(props: ModelTabProps) {
    const { model } = props

    const [batchResults, setBatchResults] = React.useState<TrainingResults>()
    const [lossSpec, setLossSpec] = React.useState<VisualizationSpec>()
    const [accSpec, setAccSpec] = React.useState<VisualizationSpec>()
    const [epochLossSpec, setEpochLossSpec] =
        React.useState<VisualizationSpec>()
    const [epochAccSpec, setEpochAccSpec] = React.useState<VisualizationSpec>()

    React.useEffect(() => {
        loadTrainingResults().then(setBatchResults)
    }, [])

    React.useEffect(() => {
        if (!batchResults) return
        const values = getBatchLossResults(batchResults)
        setLossSpec(batchLossChart(values))
    }, [batchResults, setLossSpec])

    React.useEffect(() => {
        if (!batchResults) return
        const values = getBatchAccResults(batchResults)
        setAccSpec(batchAccChart(values))
    }, [batchResults, setAccSpec])

    React.useEffect(() => {
        if (!batchResults) return
        const values = getEpochLossResults(batchResults)
        setEpochLossSpec(epochLossChart(values))
    }, [batchResults, setEpochLossSpec])

    React.useEffect(() => {
        if (!batchResults) return
        const values = getEpochAccResults(batchResults)
        setEpochAccSpec(epochAccChart(values))
    }, [batchResults, setEpochAccSpec])

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
            {batchResults && (
                <Paper
                    sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Title>onBatchEnd</Title>
                    <Chart spec={lossSpec} />
                    <Chart spec={accSpec} />
                </Paper>
            )}
            {batchResults && (
                <Paper
                    sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Title>onEpochEnd</Title>
                    <Chart spec={epochLossSpec} />
                    <Chart spec={epochAccSpec} />
                </Paper>
            )}
        </React.Fragment>
    )
}
