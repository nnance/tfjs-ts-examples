import React from 'preact'
import { StateUpdater, useState } from 'preact/compat'
import { callAPI } from '../api/util'
import * as EchoAPI from '../api/Echo'

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
        <div>
            <h1>TensorFlow.js Examples!</h1>
            <button onClick={clickHandler(setResults)}>Send</button>
            <p>
                <Results results={results} />
            </p>
        </div>
    )
}
