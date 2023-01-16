import * as React from 'react'
import { Title } from './components/Title'
import { Panel } from './components/Panel'
import { Page } from './components/Page'

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
        <Page>
            <Panel>
                <TitleSection />
            </Panel>
            <Panel>
                <Title>Fit curve with learned coefficients</Title>
            </Panel>
        </Page>
    )
}
