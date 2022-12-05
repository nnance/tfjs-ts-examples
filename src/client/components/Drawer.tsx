import * as React from 'react'
import MuiDrawer, { DrawerProps as MuiDrawerProps } from '@mui/material/Drawer'
import { styled } from '@mui/material/styles'
import Toolbar from '@mui/material/Toolbar'
import { ListItems } from './ListItems'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'

const drawerWidth = 240

interface DrawerProps extends MuiDrawerProps {
    open: boolean
}

const DrawerStyled = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== 'open',
})<DrawerProps>(({ theme, open }) => ({
    '& .MuiDrawer-paper': {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        boxSizing: 'border-box',
        ...(!open && {
            overflowX: 'hidden',
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            width: theme.spacing(7),
            [theme.breakpoints.up('sm')]: {
                width: theme.spacing(9),
            },
        }),
    },
}))

export function Drawer(props: DrawerProps) {
    return (
        <DrawerStyled variant="permanent" {...props}>
            <Toolbar
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    px: [1],
                }}
            />
            <Divider />
            <List component="nav">{ListItems}</List>
        </DrawerStyled>
    )
}
