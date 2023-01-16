import * as React from 'react'
import { Grid, Paper } from '@mui/material'

export const Panel = (props: {
    children: React.ReactNode
    height?: number
}) => {
    return (
        <Grid item xs={12}>
            <Paper
                sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: props.height || undefined,
                }}
            >
                {props.children}
            </Paper>
        </Grid>
    )
}
