import React from 'react'
import {
    classNames,
    loadTrainingResults,
    TrainedModel,
} from '../../../models/recognize-handwriting'
import { LineChart } from '../charts/linechart'
import { ChartSpec } from '../charts/types'
import { Panel } from '../Panel'
import { SummaryTable } from '../SummaryTable'
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
    results.history.loss.map((y, x) => ({ x, y: y as number })),
    results.history.val_loss.map((y, x) => ({ x, y: y as number })),
]

const getEpochAccResults = (results: TrainingResults) => [
    results.history.acc.map((y, x) => ({ x, y: y as number })),
    results.history.val_acc.map((y, x) => ({ x, y: y as number })),
]

// transform batch results to line chart
const batchLossChart = (
    values: ReturnType<typeof getBatchLossResults>
): ChartSpec => ({
    data: { values, series: ['loss'] },
    options: {
        xLabel: 'Batch',
        yLabel: 'Value',
        height: 300,
    },
})

const batchAccChart = (
    values: ReturnType<typeof getBatchAccResults>
): ChartSpec => ({
    data: { values, series: ['acc'] },
    options: {
        xLabel: 'Batch',
        yLabel: 'Value',
        height: 300,
    },
})

const epochLossChart = (
    values: ReturnType<typeof getEpochLossResults>
): ChartSpec => ({
    data: { values, series: ['loss', 'val_loss'] },
    options: {
        xLabel: 'Epoch',
        yLabel: 'Value',
        height: 300,
    },
})

const epochAccChart = (
    values: ReturnType<typeof getEpochAccResults>
): ChartSpec => ({
    data: { values, series: ['acc', 'val_acc'] },
    options: {
        xLabel: 'Epoch',
        yLabel: 'Value',
        height: 300,
    },
})

const modelSummaryCols = [
    'Layer Name',
    'Output Shape',
    '# Of Params',
    'Trainable',
]
const modelToRows = (model: TrainedModel) =>
    model
        .summary()
        .map((l) => [
            l.name,
            l.outputShape,
            l.parameters,
            l.trainable ? 'Yes' : 'No',
        ])

const accuracySummaryCols = ['Class', 'Accuracy', '# Of Images']
const accuracyToRows = (results: TrainingResults) =>
    results.accuracy.map((l, i) => [
        classNames[i],
        l.accuracy.toFixed(3),
        l.count,
    ])

export function ModelTab(props: ModelTabProps) {
    const { model } = props

    const [batchResults, setBatchResults] = React.useState<TrainingResults>()
    const [lossSpec, setLossSpec] = React.useState<ChartSpec>()
    const [accSpec, setAccSpec] = React.useState<ChartSpec>()
    const [epochLossSpec, setEpochLossSpec] = React.useState<ChartSpec>()
    const [epochAccSpec, setEpochAccSpec] = React.useState<ChartSpec>()

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
            {model && (
                <Panel>
                    <React.Fragment>
                        <Title>Model Summary</Title>
                        <SummaryTable
                            cols={modelSummaryCols}
                            values={modelToRows(model)}
                        />
                    </React.Fragment>
                </Panel>
            )}
            {batchResults && (
                <Panel>
                    <Title>onBatchEnd</Title>
                    <LineChart spec={lossSpec} />
                    <LineChart spec={accSpec} />
                </Panel>
            )}
            {batchResults && (
                <Panel>
                    <Title>onEpochEnd</Title>
                    <LineChart spec={epochLossSpec} />
                    <LineChart spec={epochAccSpec} />
                </Panel>
            )}
            {batchResults && (
                <Panel>
                    <React.Fragment>
                        <Title>Accuracy Summary</Title>
                        <SummaryTable
                            cols={accuracySummaryCols}
                            values={accuracyToRows(batchResults)}
                        />
                    </React.Fragment>
                </Panel>
            )}
        </React.Fragment>
    )
}
