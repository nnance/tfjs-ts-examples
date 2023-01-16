import React from 'react'
import { Container, Grid, Paper } from '@mui/material'
import Toolbar from '@mui/material/Toolbar'
import { Title } from './components/Title'

function TitleSection() {
    return (
        <section>
            <h1>Fitting a curve to synthetic data</h1>
            <p>Train a model to learn the coefficients of a cubic function.</p>
            <p>
                This model learns to approximate the coefficients of a cubic
                function used to generate the points shown below on the left.
            </p>
        </section>
    )
}

export const FitToCurve = (props: { setTitle: (title: string) => void }) => {
    React.useEffect(() => {
        props.setTitle('Fit To Curve')
    }, [props])

    return (
        <React.Fragment>
            <Toolbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <TitleSection />
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                height: 360,
                            }}
                        >
                            <Title>Fit curve with learned coefficients</Title>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </React.Fragment>
    )
}
