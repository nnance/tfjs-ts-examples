import React from 'react'
import { Batch, getImagesFromTensors } from '../../../data/mnist'
import { TensorImage } from '../TensorImage'

type InputTabProps = {
    testData?: Batch
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
