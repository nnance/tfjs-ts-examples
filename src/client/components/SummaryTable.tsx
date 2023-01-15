import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

interface SummaryProps<T> {
    cols: string[]
    values: T[]
}

export function SummaryTable<T>(props: SummaryProps<T>) {
    const { cols, values } = props

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
                            {Array.isArray(row) &&
                                row.map((col, key) => (
                                    <TableCell key={key}>{col}</TableCell>
                                ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
