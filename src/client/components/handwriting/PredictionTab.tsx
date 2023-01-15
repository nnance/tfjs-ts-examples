import React from 'react'
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
} from '@mui/material'
import { PredictionResults } from '../../../models/recognize-handwriting'
import { TensorImage } from '../TensorImage'
import { useState } from 'react'
import { useEffect } from 'preact/hooks'
import { Batch, getImagesFromTensors } from '../../../data/mnist'

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
function verticalTable(examples: ImageData[], results: PredictionResults) {
    const transformed = [
        [...cols],
        ...results.map((row, i) => [
            examples[i],
            row[0].className,
            row[0].value.toFixed(3),
        ]),
    ]
    return transformed
}

// type guard to check if the data is an ImageData
function isImageData(data: ImageData | string[] | string): data is ImageData {
    return data instanceof ImageData
}

export function PredictionTab(props: PredictionResultsProps) {
    const { testData, results } = props

    const [examples, setExamples] = useState<ImageData[]>([])

    useEffect(() => {
        if (!testData) return
        getImagesFromTensors(testData).then(setExamples)
    }, [testData])

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableBody>
                    {results &&
                        verticalTable(examples, results).map((row, key) => (
                            <TableRow key={key}>
                                {row.map((col, key) => (
                                    <TableCell key={key}>
                                        {isImageData(col) ? (
                                            <TensorImage imageData={col} />
                                        ) : (
                                            col
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
