import React from 'react'
import { TensorImage } from '../TensorImage'

type InputTabProps = {
    examples: ImageData[]
}

export function InputTab(props: InputTabProps) {
    const { examples } = props
    return (
        <React.Fragment>
            {examples.map((tensor, key) => (
                <TensorImage key={key} imageData={tensor} />
            ))}
        </React.Fragment>
    )
}
