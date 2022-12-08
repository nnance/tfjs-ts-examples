import * as React from 'react'
import * as tf from '@tensorflow/tfjs'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

//
// Helper functions
//
function getModelSummary(model: tf.LayersModel) {
    return {
        layers: model.layers.map(getLayerSummary),
    }
}

/*
 * Gets summary information/metadata about a layer.
 */
function getLayerSummary(layer: tf.layers.Layer): LayerSummary {
    let outputShape: string
    if (Array.isArray(layer.outputShape[0])) {
        const shapes = (layer.outputShape as number[][]).map((s) =>
            formatShape(s)
        )
        outputShape = `[${shapes.join(', ')}]`
    } else {
        outputShape = formatShape(layer.outputShape as number[])
    }

    return {
        name: layer.name,
        trainable: layer.trainable,
        parameters: layer.countParams(),
        outputShape,
    }
}

function formatShape(shape: number[]): string {
    const oShape: Array<number | string> = shape.slice()
    if (oShape.length === 0) {
        return 'Scalar'
    }
    if (oShape[0] === null) {
        oShape[0] = 'batch'
    }
    return `[${oShape.join(',')}]`
}

interface LayerSummary {
    name: string
    trainable: boolean
    parameters: number
    outputShape: string
}

interface ModelSummaryProps {
    model: tf.LayersModel
}

export function ModelSummary(props: ModelSummaryProps) {
    const { model } = props
    const summary = getModelSummary(model)

    const cols = ['Layer Name', 'Output Shape', '# Of Params', 'Trainable']

    const values = summary.layers.map((l) => [
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
