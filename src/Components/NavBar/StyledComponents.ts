import AdbIcon from '@mui/icons-material/Adb';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { mq } from './NavBar';
import { styled } from '@mui/material'

const StyledAppBar = styled(AppBar)(() => ({
  backgroundColor: 'white'
}))

const NavBarBox = styled(Box)(() => ({
  display: 'flex',
}))

const NavButton = styled(Button)(() => ({
  [mq.mobile]: {
    display: 'none',
  }
}))

const AppIcon = styled(AdbIcon)(() => ({
  color: 'black',
  display: 'flex',
  marginRight: 8, 
  '@media (max-width: 600px)': {
    display: 'flex',
  },
  '@media (min-width: 960px)': {
    display: 'flex',
  },
}));

const HomeLink = styled(Typography)(() => ({
  marginRight: 16, 
  display: 'flex',
  flexGrow: 1,
  fontFamily: 'monospace',
  fontWeight: 700,
  letterSpacing: '.3rem',
  color: 'inherit',
  textDecoration: 'none',
  '@media (max-width: 600px)': { 
    display: 'flex',
  },
  '@media (min-width: 960px)': { 
    display: 'flex',
  },
}));

export {
  StyledAppBar,
  NavBarBox,
  NavButton,
  AppIcon,
  HomeLink,
}