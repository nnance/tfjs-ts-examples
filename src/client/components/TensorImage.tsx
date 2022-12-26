import React from 'react'
import { useEffect } from 'react'

interface TensorImageProps {
    imageData: ImageData
}

// TODO: Take a tensor as input and render it as an image instead of an ImageData
// TODO: render individual images and delete renderExamples in models/recognize-handwriting.ts

export function TensorImage(props: TensorImageProps) {
    const canvasRef = React.useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        async function render() {
            if (canvasRef.current) {
                canvasRef.current
                    .getContext('2d')
                    ?.putImageData(props.imageData, 0, 0)
            }
        }

        render()
    }, [canvasRef, props])

    return (
        <canvas
            width={28}
            height={28}
            style={{ margin: '4px;' }}
            ref={canvasRef}
        ></canvas>
    )
}
