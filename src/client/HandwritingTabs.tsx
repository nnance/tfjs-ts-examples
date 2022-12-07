import * as React from 'react'
import * as tf from '@tensorflow/tfjs'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { Title } from './components/Title'
import { useEffect } from 'preact/hooks'

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

interface SmallImageProps {
    key: number
    imageTensor: tf.Tensor<tf.Rank>
}

function SmallImage(props: SmallImageProps) {
    const { key, imageTensor } = props
    const canvasRef = React.useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        if (canvasRef.current) {
            tf.browser.toPixels(imageTensor as tf.Tensor2D, canvasRef.current)
        }
        imageTensor.dispose()
    }, [canvasRef, imageTensor])

    const element = React.createElement('canvas', {
        width: 28,
        height: 28,
        style: { margin: '4px;' },
        ref: canvasRef,
        key,
    })
    return element
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    }
}

type TabsProps = {
    examples: tf.Tensor<tf.Rank>[]
}

export function HandwritingTabs(props: TabsProps) {
    const [value, setValue] = React.useState(0)

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue)
    }

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
                    <Tab label="Item Two" {...a11yProps(1)} />
                    <Tab label="Item Three" {...a11yProps(2)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <div style={{ width: '100%', height: '100%' }}>
                    {props.examples.map((tensor, key) => {
                        console.log(`example: ${key}`)
                        return <SmallImage key={key} imageTensor={tensor} />
                    })}
                </div>
            </TabPanel>
            <TabPanel value={value} index={1}>
                Item Two
            </TabPanel>
            <TabPanel value={value} index={2}>
                Item Three
            </TabPanel>
        </Box>
    )
}
