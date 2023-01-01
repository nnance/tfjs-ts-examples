import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { classNames } from '../../models/recognize-handwriting'

interface AccuracySummaryProps {
    summary: {
        accuracy: number
        count: number
    }[]
}

export function AccuracySummary(props: AccuracySummaryProps) {
    const { summary } = props

    const cols = ['Class', 'Accuracy', '# Of Images']

    const values = summary.map((l, i) => [
        classNames[i],
        l.accuracy.toFixed(3),
        l.count,
    ])

    // TODO: generalize this into a reusable component
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
                    {values.map((row, key) => (
                        <TableRow key={key}>
                            {row.map((col, key) => (
                                <TableCell key={key}>{col}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
