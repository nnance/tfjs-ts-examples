import React from 'react'
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material'

export type PredictionResult = {
    className: string
    value: number
}

type PredictionResultsProps = {
    results: PredictionResult[]
}

export function PredictionResults(props: PredictionResultsProps) {
    const { results } = props
    const cols = ['Class', 'Score']

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        {cols.map((col, key) => (
                            <TableCell key={key}>{col}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {results.map((row, key) => (
                        <TableRow key={key}>
                            <TableCell>{row.className}</TableCell>
                            <TableCell>{row.value}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
