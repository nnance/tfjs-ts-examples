import React from 'preact'
import { StateUpdater, useState } from 'preact/compat'

const Results = ({ results }: { results: string }) => (
    <label>Results: {results}</label>
)

const clickHandler = (setResults: StateUpdater<string>) => () => {
    fetch('http://localhost:8080/echo?message=hello').then((res) =>
        res.text().then(setResults)
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
