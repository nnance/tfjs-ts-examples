import * as React from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import { AppBar } from './AppBar'
import { Drawer } from './Drawer'
import { Home } from './Home'
import { Routes, Route, Outlet } from 'react-router-dom'
import { useState } from 'preact/hooks'

const mdTheme = createTheme()

interface LayoutProps {
    title: string
}

function Layout(props: LayoutProps) {
    const { title } = props
    const [open, setOpen] = React.useState(true)
    const toggleDrawer = () => {
        setOpen(!open)
    }

    return (
        <ThemeProvider theme={mdTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar open={open} toggleDrawer={toggleDrawer} title={title} />
                <Drawer open={open} toggleDrawer={toggleDrawer} />
                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                    }}
                >
                    <Outlet />
                </Box>
            </Box>
        </ThemeProvider>
    )
}

export function App() {
    const [title, setTitle] = useState('Home')

    return (
        <Routes>
            <Route path="/" element={<Layout title={title} />}>
                <Route index element={<Home setTitle={setTitle} />} />
            </Route>
        </Routes>
    )
}
