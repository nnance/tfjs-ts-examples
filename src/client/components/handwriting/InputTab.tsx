import React from 'react'
import { Batch } from '../../../data/mnist'
import { getImagesFromTensors } from '../../../models/recognize-handwriting'
import { TensorImage } from '../TensorImage'

type InputTabProps = {
    testData: Batch | undefined
}

export function InputTab(props: InputTabProps) {
    const { testData } = props

    const [examples, setExamples] = React.useState<ImageData[]>([])

    React.useEffect(() => {
        if (!testData) return
        getImagesFromTensors(testData).then(setExamples)
    }, [testData])

    return (
        <React.Fragment>
            {examples.map((tensor, key) => (
                <TensorImage key={key} imageData={tensor} />
            ))}
        </React.Fragment>
    )
}
