import * as React from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import { AppBar } from './components/AppBar'
import { Drawer } from './components/Drawer'
import { Home } from './Home'
import { Routes, Route, Outlet } from 'react-router-dom'
import { useState } from 'preact/hooks'
import { Predict2D } from './predict-2d-data'
import { RecognizeHandwriting } from './recognize-handwriting'
import { FitToCurve } from './fit-to-curve'

const mdTheme = createTheme()

interface LayoutProps {
    title: string
}

function Layout(props: LayoutProps) {
    const { title } = props

    return (
        <ThemeProvider theme={mdTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar open={true} title={title} />
                <Drawer open={true} />
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
                <Route
                    path="fit-to-curve"
                    element={<FitToCurve setTitle={setTitle} />}
                />
                <Route
                    path="predict-2d"
                    element={<Predict2D setTitle={setTitle} />}
                />
                <Route
                    path="recognize-handwriting"
                    element={<RecognizeHandwriting setTitle={setTitle} />}
                />
            </Route>
        </Routes>
    )
}
