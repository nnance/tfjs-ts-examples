import * as React from 'react'
import { Button } from '@mui/material'

export const PrimaryButton = (props: {
    children: React.ReactNode
    onClick: () => void
    disabled?: boolean
}) => {
    return (
        <Button
            variant="contained"
            color="primary"
            onClick={props.onClick}
            disabled={props.disabled}
            sx={{ m: 1 }}
        >
            {props.children}
        </Button>
    )
}
