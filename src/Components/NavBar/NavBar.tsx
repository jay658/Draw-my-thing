import {
  AppIcon,
  HomeLink,
  NavBarBox,
  NavButton,
  StyledAppBar,
} from './StyledComponents'

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import MusicPlayer from '../MusicPlayer/MusicPlayer';
import Toolbar from '@mui/material/Toolbar';
import socket from '../Websocket/socket';
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
}

const mobile = new Set(['Draw', 'Join Screen', 'Rooms'])

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