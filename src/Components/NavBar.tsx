import * as React from 'react';

import AdbIcon from '@mui/icons-material/Adb';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import MusicPlayer from './MusicPlayer/MusicPlayer';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import socket from './Websocket/socket';
import { styled } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const breakpoints = {
  mobile: 768
};

export const mq = {
  mobile: `@media (max-width: ${breakpoints.mobile}px)`
};

const tabs = {
  Home: '',
  'Join Screen': 'join',
  Draw: 'draw',
  Rooms: 'rooms'
}

const mobile = new Set(['Draw', 'Join Screen', 'Rooms'])

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

function ResponsiveAppBar() {
  const navigate = useNavigate()

  const handleNavClick = (linkRoute: string) => {
    socket.emit('leave_room')
    navigate(`/loading?redirect=/${linkRoute}`)
  }

  return (
    <StyledAppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <HomeLink variant="h5" noWrap>
            <Button onClick={() => navigate('/')}><AppIcon/></Button>
          </HomeLink>
          <NavBarBox>
            <MusicPlayer/>
            {Object.entries(tabs).map(entry => {
              const [linkName, linkRoute] = entry
              return(
                  <NavButton onClick={() => handleNavClick(linkRoute)} key={linkName} style={!mobile.has(linkName)?{}: {display:'flex'}}>
                    {linkName}
                  </NavButton>
              )
            })}
          </NavBarBox>
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
}
export default ResponsiveAppBar;