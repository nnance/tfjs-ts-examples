import * as React from 'react'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'

export const ListItems = (
    <React.Fragment>
        <ListItemButton href="/">
            <ListItemText primary="Get Started" />
        </ListItemButton>
        <ListItemButton href="/predict-2d">
            <ListItemText primary="Predict 2D Data" />
        </ListItemButton>
        <ListItemButton href="/recognize-handwriting">
            <ListItemText primary="Recognize Handwriting" />
        </ListItemButton>
        <ListItemButton>
            <ListItemText primary="Cart Pole" />
        </ListItemButton>
    </React.Fragment>
)
