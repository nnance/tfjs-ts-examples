import * as React from 'react'
import * as tf from '@tensorflow/tfjs'
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

interface TabPanelProps {
    children?: React.ReactNode
    index: number
    value: number
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

interface TabsProps {
    examples: ImageData[]
    model: tf.LayersModel
}

export function HandwritingTabs(props: TabsProps) {
    const { examples, model } = props
    const [value, setValue] = React.useState(0)
    const [spec, setSpec] = React.useState<VisualizationSpec>()

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue)
    }

    React.useEffect(() => {
        const series1 = Array(100)
            .fill(0)
            .map(() => Math.random() * 100 - Math.random() * 50)
            .map((y, x) => ({ x, y }))

        const series2 = Array(100)
            .fill(0)
            .map(() => Math.random() * 100 - Math.random() * 150)
            .map((y, x) => ({ x, y }))

        const series = ['First', 'Second']
        const data = { values: [series1, series2], series }
        setSpec(lineChart(data, {}))
    }, [setSpec])

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
            </TabPanel>
            <TabPanel value={value} index={1}>
                <ModelSummary model={model} />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <Paper
                    sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        height: 360,
                    }}
                >
                    <Title>Example Line Chart</Title>
                    <Chart spec={spec} />
                </Paper>
            </TabPanel>
        </Box>
    )
}
