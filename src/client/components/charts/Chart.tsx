import React from 'react'
import { useRef, useEffect } from 'react'
import vegaEmbed from 'vega-embed'
import { Mode, VisualizationSpec } from 'vega-embed'

type ChartProps = {
    spec?: VisualizationSpec
}

export function Chart({ spec }: ChartProps) {
    const divRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const embedOpts = {
            actions: false,
            mode: 'vega-lite' as Mode,
            defaultStyle: false,
        }
        if (spec) {
            vegaEmbed(divRef.current as HTMLElement, spec, embedOpts)
        }
    }, [spec, divRef])

    return <div ref={divRef} style={{ width: '100%', height: '100%' }}></div>
}
