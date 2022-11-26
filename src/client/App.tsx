import React from 'preact'
import { StateUpdater, useState } from 'preact/compat'
import { callAPI } from '../api/util'
import * as EchoAPI from '../api/Echo'

function TitleSection() {
    return (
        <section class="title-area">
            <h1>TensorFlow.js: Examples</h1>
            <p class="subtitle">
                Train a model to balance a pole on a cart using reinforcement
                learning.
            </p>
        </section>
    )
}

function DescriptionSection() {
    return (
        <section>
            <p class="section-head">Description</p>
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
                Through <span class="in-type">self play</span> the agent will
                learn to balance the pole for as many
                <span class="out-example">steps</span> as it can.
            </p>
        </section>
    )
}

function InstructionsSection() {
    return (
        <section>
            <p class="section-head">Instructions</p>
            <p></p>
            <ul>
                <li>Choose a hidden layer size and click "Create Model".</li>
                <li>Select training parameters and then click "Train".</li>
                <li>
                    Note that while the model is training it periodically saves
                    a copy of itself to local browser storage, this mean you can
                    refresh the page and continue training from the last save
                    point. If at any point you want to start training from
                    scratch, click "Delete stored Model".
                </li>
                <li>
                    Once the model has finished training you can click "Test" to
                    see how many 'steps' the agent can balance the pole for. You
                    can also click 'Stop' to pause the training after the
                    current iteration ends if you want to test the model sooner.
                </li>
                <li>
                    During training and testing a small simulation of the agent
                    behaviour will be rendered.
                </li>
            </ul>
        </section>
    )
}
const Results = ({ results }: { results: string }) => (
    <label>Results: {results}</label>
)

const clickHandler = (setResults: StateUpdater<string>) => () => {
    const data = { message: 'hello world' }
    callAPI<EchoAPI.Request, EchoAPI.Response>(EchoAPI.URL, data).then((res) =>
        setResults(res.echo)
    )
}

export const App = () => {
    const [results, setResults] = useState('')

    return (
        <div class="example-container centered-container">
            <TitleSection />
            <DescriptionSection />
            <InstructionsSection />
            <button onClick={clickHandler(setResults)}>Send</button>
            <p>
                <Results results={results} />
            </p>
        </div>
    )
}
