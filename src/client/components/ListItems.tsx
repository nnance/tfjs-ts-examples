import * as React from 'react'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'

export const ListItems = (
    <React.Fragment>
        <ListItemButton href="/">
            <ListItemText primary="Get Started" />
        </ListItemButton>
        <ListItemButton href="/fit-to-curve">
            <ListItemText primary="Fit to curve" />
        </ListItemButton>
        <ListItemButton href="/recognize-handwriting">
            <ListItemText primary="Recognize handwriting" />
        </ListItemButton>
        <ListItemButton>
            <ListItemText primary="Cart Pole" />
        </ListItemButton>
    </React.Fragment>
)
