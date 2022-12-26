import * as React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { PredictionTab } from './handwriting/PredictionTab'
import { TrainedModel } from '../../models/recognize-handwriting'
import { InputTab } from './handwriting/InputTab'
import { ModelTab } from './handwriting/ModelTab'
import { Batch } from '../../data/mnist'

interface TabPanelProps {
    children?: React.ReactNode
    index: number
    value: number
}

interface TabsProps {
    model: TrainedModel | undefined
    testData: Batch | undefined
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

// TODO: Make this a generic component with dynamic tabs
// TODO: remove the model and testData props

export function HandwritingTabs(props: TabsProps) {
    const { testData, model } = props
    const [value, setValue] = React.useState(0)

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue)
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example"
                >
                    <Tab label="Input Data" {...a11yProps(0)} />
                    <Tab label="Model" {...a11yProps(1)} />
                    <Tab label="Test Results" {...a11yProps(2)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <InputTab testData={testData} />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <ModelTab model={model} />
            </TabPanel>
            <TabPanel value={value} index={2}>
                {testData && model && (
                    <React.Fragment>
                        <PredictionTab model={model} testData={testData} />
                    </React.Fragment>
                )}
            </TabPanel>
        </Box>
    )
}
