import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { TrainedModel } from '../../models/recognize-handwriting'

//
// Helper functions
//
interface ModelSummaryProps {
    model: TrainedModel
}

export function ModelSummary(props: ModelSummaryProps) {
    const { model } = props
    const layers = model.summary()

    const cols = ['Layer Name', 'Output Shape', '# Of Params', 'Trainable']

    const values = layers.map((l) => [
        l.name,
        l.outputShape,
        l.parameters,
        l.trainable,
    ])

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
