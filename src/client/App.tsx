import * as React from 'react'
import { useState } from 'preact/hooks'
import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './Home'
import { Predict2D } from './predict-2d-data'
import { RecognizeHandwriting } from './recognize-handwriting'
import { FitToCurve } from './fit-to-curve'

export function App() {
    const [title, setTitle] = useState('Home')

    return (
        <Routes>
            <Route path="/" element={<Layout title={title} />}>
                <Route index element={<Home setTitle={setTitle} />} />
                <Route
                    path="fit-to-curve"
                    element={<FitToCurve setTitle={setTitle} />}
                />
                <Route
                    path="predict-2d"
                    element={<Predict2D setTitle={setTitle} />}
                />
                <Route
                    path="recognize-handwriting"
                    element={<RecognizeHandwriting setTitle={setTitle} />}
                />
            </Route>
        </Routes>
    )
}
