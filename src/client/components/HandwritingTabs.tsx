import * as React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { Title } from './Title'
import { ModelSummary } from './ModelSummary'
import { TensorImage } from './TensorImage'
import { lineChart } from './charts/linechart'
import { VisualizationSpec } from 'vega-embed'
import { Chart } from './Chart'
import Paper from '@mui/material/Paper'
import { PredictionTable } from './PredictionTable'
import {
    PredictionResults,
    TrainedModel,
} from '../../models/recognize-handwriting'

interface TabPanelProps {
    children?: React.ReactNode
    index: number
    value: number
}

export type BatchResult = {
    batchNumber: number
    acc: number
    loss: number
}

interface TabsProps {
    examples: ImageData[]
    model: TrainedModel | undefined
    batchResults: BatchResult[]
    predictions: PredictionResults | undefined
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    )
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    }
}

export function HandwritingTabs(props: TabsProps) {
    const { examples, model, batchResults, predictions } = props
    const [value, setValue] = React.useState(0)
    const [spec, setSpec] = React.useState<VisualizationSpec>()
    const [accSpec, setAccSpec] = React.useState<VisualizationSpec>()

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue)
    }

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
        <Box sx={{ width: '100%' }}>
            <Title>Input Data Examples</Title>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example"
                >
                    <Tab label="Input Data" {...a11yProps(0)} />
                    <Tab label="Model" {...a11yProps(1)} />
                    <Tab label="Item Three" {...a11yProps(2)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                {examples.map((tensor, key) => (
                    <TensorImage key={key} imageData={tensor} />
                ))}
                {predictions && (
                    <React.Fragment>
                        <Title>Predictions</Title>
                        <PredictionTable results={predictions} />
                    </React.Fragment>
                )}
            </TabPanel>
            <TabPanel value={value} index={1}>
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
                            height: 700,
                        }}
                    >
                        <Title>onBatchEnd</Title>
                        <Chart spec={spec} />
                        <Chart spec={accSpec} />
                    </Paper>
                )}
            </TabPanel>
            <TabPanel value={value} index={2}></TabPanel>
        </Box>
    )
}
