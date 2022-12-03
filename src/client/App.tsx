import React from 'preact'
import { useState } from 'preact/compat'
import { callAPI } from '../api/util'
import { echoHandler, EchoProps, EchoURL } from '../server/api'

function TitleSection() {
    return (
        <section className="title-area">
            <h1>TensorFlow.js: Examples</h1>
            <p className="subtitle">
                Train a model to balance a pole on a cart using reinforcement
                learning.
            </p>
        </section>
    )
}

function DescriptionSection() {
    return (
        <section>
            <p className="section-head">Description</p>
            <p>
                This example illustrates how to use TensorFlow.js to perform
                simple
                <a href="https://en.wikipedia.org/wiki/Reinforcement_learning">
                    reinforcement learning
                </a>
                (RL). Specifically, it showcases an implementation of the
                policy-gradient method in TensorFlow.js. This implementation is
                used to solve the classic
                <a href="https://en.wikipedia.org/wiki/Inverted_pendulum">
                    cart-pole control problem.
                </a>
            </p>

            <p>
                Through <span className="in-type">self play</span> the agent
                will learn to balance the pole for as many
                <span className="out-example">steps</span> as it can.
            </p>
        </section>
    )
}

function InstructionsSection() {
    return (
        <section>
            <p className="section-head">Instructions</p>
            <p></p>
            <ul>
                <li>
                    Choose a hidden layer size and click &quot;Create
                    Model&quot;.
                </li>
                <li>
                    Select training parameters and then click &quot;Train&quot;.
                </li>
                <li>
                    Note that while the model is training it periodically saves
                    a copy of itself to local browser storage, this mean you can
                    refresh the page and continue training from the last save
                    point. If at any point you want to start training from
                    scratch, click &quot;Delete stored Model&quot;.
                </li>
                <li>
                    Once the model has finished training you can click
                    &quot;Test&quot; to see how many &quot;steps&quot; the agent
                    can balance the pole for. You can also click
                    &quot;Stop&quot; to pause the training after the current
                    iteration ends if you want to test the model sooner.
                </li>
                <li>
                    During training and testing a small simulation of the agent
                    behavior will be rendered.
                </li>
            </ul>
        </section>
    )
}
const Results = ({ results }: { results: string }) => (
    <label>Results: {results}</label>
)

export const App = () => {
    const [results, setResults] = useState('')

    const clickHandler = () => () => {
        const data = { message: 'hello world' }
        callAPI<EchoProps, ReturnType<typeof echoHandler>>(EchoURL, data).then(
            (res) => setResults(res.echo)
        )
    }

    return (
        <div className="example-container centered-container">
            <TitleSection />
            <DescriptionSection />
            <InstructionsSection />
            <button onClick={clickHandler()}>Send</button>
            <p>
                <Results results={results} />
            </p>
        </div>
    )
}
