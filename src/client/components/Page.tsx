import * as React from 'react'
import { Container, Grid, Toolbar } from '@mui/material'

export const Page = (props: { children: React.ReactNode }) => {
    return (
        <React.Fragment>
            <Toolbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>
                    {props.children}
                </Grid>
            </Container>
        </React.Fragment>
    )
}
