import React, { FunctionComponent } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

interface TabPanelProps {
    children?: React.ReactNode
    index: number
    value: number
}

interface TabsProps {
    tabs: {
        label: string
        component: FunctionComponent
    }[]
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

export function TabContainer(props: TabsProps) {
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
                    {props.tabs.map((tab, index) => (
                        <Tab
                            label={tab.label}
                            key={index}
                            {...a11yProps(index)}
                        />
                    ))}
                </Tabs>
            </Box>
            {props.tabs.map((tab, index) => (
                <TabPanel value={value} key={index} index={index}>
                    {React.createElement(tab.component, {})}
                </TabPanel>
            ))}
        </Box>
    )
}
