import React from 'react'
import { PredictionResults } from '../../../models/recognize-handwriting'
import { TensorImage } from '../TensorImage'
import { useState } from 'react'
import { useEffect } from 'preact/hooks'
import { Batch, getImagesFromTensors } from '../../../data/mnist'
import { SummaryTable } from '../SummaryTable'

type PredictionResultsProps = {
    testData?: Batch
    results?: PredictionResults
}

const cols = ['Image', 'Prediction', 'Confidence']

// transform the results into a horizontal table
// so that we can display the images and the results
// side by side
function horizontalTable(examples: ImageData[], results: PredictionResults) {
    const transformed = [
        [cols[0], ...examples],
        [cols[1], ...results.map((row) => row[0].className)],
        [cols[2], ...results.map((row) => row[0].value.toFixed(3))],
    ]
    return transformed
}

// transform the results into a vertical table
// so that we can display the images and the results
// side by side
const verticalTable = (examples: ImageData[], results: PredictionResults) =>
    results.map((row, i) => [
        <TensorImage key={i} imageData={examples[i]} />,
        row[0].className,
        row[0].value.toFixed(3),
    ])

export function PredictionTab(props: PredictionResultsProps) {
    const { testData, results } = props

    const [tensors, setTensors] = useState<ImageData[]>([])

    useEffect(() => {
        if (!testData) return
        getImagesFromTensors(testData).then((images) => setTensors(images))
    }, [testData])

    return (
        (results && tensors.length > 0 && (
            <SummaryTable
                cols={cols}
                values={verticalTable(tensors, results)}
            />
        )) || <div>Evaluate model to see results</div>
    )
}
