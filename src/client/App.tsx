import React from 'preact'
import { StateUpdater, useState } from 'preact/compat'

// Example POST method implementation:
async function postData<T>(url = '', data = {}): Promise<T> {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
    return response.json() // parses JSON response into native JavaScript objects
}

const Results = ({ results }: { results: string }) => (
    <label>Results: {results}</label>
)

const clickHandler = (setResults: StateUpdater<string>) => () => {
    type EchoResponse = { echo: string }
    postData<EchoResponse>('http://localhost:8080/echo', {
        message: 'hello world',
    }).then((res) => setResults(res.echo))
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
