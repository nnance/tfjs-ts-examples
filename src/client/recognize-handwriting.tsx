import * as React from 'react'
import { useEffect, useState } from 'react'
import { Batch, loadMnistData } from '../data/mnist'
import { TabContainer } from './components/TabContainer'
import {
    loadTrainedModel,
    PredictionResults,
    TrainedModel,
} from '../models/recognize-handwriting'
import { InputTab } from './components/handwriting/InputTab'
import { ModelTab } from './components/handwriting/ModelTab'
import { PredictionTab } from './components/handwriting/PredictionTab'
import { Page } from './components/Page'
import { Panel } from './components/Panel'
import { PrimaryButton } from './components/PrimaryButtons'

function TitleSection() {
    return (
        <section>
            <h1>Handwritten digit recognition with CNNs</h1>
            <p>
                In this tutorial, we will build a TensorFlow.js model to
                recognize handwritten digits with a convolutional neural
                network. First, we will train the classifier by having it “look”
                at thousands of handwritten digit images and their labels. Then
                we will evaluate the classifier&apos;s accuracy using test data
                that the model has never seen.
            </p>
        </section>
    )
}

export const RecognizeHandwriting = (props: {
    setTitle: (title: string) => void
}) => {
    useEffect(() => {
        props.setTitle('Recognize handwriting')
    }, [props])

    const [model, setModel] = useState<TrainedModel>()
    const [runEvaluation, setRunEvaluation] = useState(false)
    const [testData, setTestData] = useState<Batch>()
    const [results, setResults] = useState<PredictionResults>()

    useEffect(() => {
        loadMnistData().then((data) => {
            const examples = data.nextTestBatch(20).toTensor()
            setTestData(examples)
        })
    }, [])

    useEffect(() => {
        loadTrainedModel().then(setModel)
    }, [])

    useEffect(() => {
        if (!model || !testData || !runEvaluation) return
        const results = model.predict(testData)
        setResults(results)
        setRunEvaluation(false)
    }, [runEvaluation, model, testData])

    const tabs = [
        {
            label: 'Input',
            component: () => <InputTab testData={testData} />,
        },
        {
            label: 'Model',
            component: () => <ModelTab model={model} />,
        },
        {
            label: 'Evaluation',
            component: () => (
                <PredictionTab testData={testData} results={results} />
            ),
        },
    ]

    return (
        <Page>
            <Panel>
                <TitleSection />
                <PrimaryButton
                    onClick={() => setRunEvaluation(true)}
                    disabled={runEvaluation}
                >
                    {runEvaluation ? 'Training...' : 'Evaluate Model'}
                </PrimaryButton>
            </Panel>
            <Panel>
                <TabContainer tabs={tabs} />
            </Panel>
        </Page>
    )
}
