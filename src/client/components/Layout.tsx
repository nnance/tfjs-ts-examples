import * as React from 'react'
import { ThemeProvider } from '@emotion/react'
import { createTheme, Box, CssBaseline } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { AppBar } from './AppBar'
import { Drawer } from './Drawer'

interface LayoutProps {
    title: string
}

export function Layout(props: LayoutProps) {
    const { title } = props

    const mdThemeRef = React.useRef(createTheme())

    return (
        <ThemeProvider theme={mdThemeRef.current}>
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
