import * as React from 'react'
import Typography, { TypographyProps } from '@mui/material/Typography'

export function Title(props: TypographyProps) {
    return (
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
            {props.children}
        </Typography>
    )
}
