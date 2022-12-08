import React from 'react'
import { useEffect } from 'react'

interface TensorImageProps {
    imageData: ImageData
}

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

    const element = React.createElement('canvas', {
        width: 28,
        height: 28,
        style: { margin: '4px;' },
        ref: canvasRef,
    })
    return element
}
