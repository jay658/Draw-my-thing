import * as React from 'react';

import AdbIcon from '@mui/icons-material/Adb';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import DefaultUserIcon from '../assets/default-user-icon.png'
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material'
import { useLogoutMutation } from '../Store/RTK/authSlice';
import { useNavigate } from 'react-router-dom'

const breakpoints = {
  mobile: 768
};

const mq = {
  mobile: `@media (max-width: ${breakpoints.mobile}px)`
};

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const tabs = {
  Home: '',
  About: 'about',
  Draw: 'draw',
  'Join Screen': 'join',
  Rooms: 'rooms'
}

const mobile = new Set(['Draw', 'Join Screen', 'Rooms'])

const StyledAppBar = styled(AppBar)(() => ({
  backgroundColor: 'white'
}))

const NavBarBox = styled(Box)(() => ({
  display: 'flex',
}))

const MobileButton = styled(Button)(() => ({
  [mq.mobile]: {
    display: 'none', // Hide all tabs by default on mobile
  }
}))

function ResponsiveAppBar() {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const navigate = useNavigate()

  const [logoutMutation] = useLogoutMutation()

  const handleLogout = async () => {
    await logoutMutation();
  };

  return (
    <StyledAppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'flex', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'flex' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <Button onClick={() => navigate('/')}>LOGO</Button>
          </Typography>
          <NavBarBox>
            {Object.entries(tabs).map(entry => {
              const [linkName, linkRoute] = entry
              console.log(linkName)
              return(
                  <MobileButton onClick={() => navigate(`/${linkRoute}`)} key={linkName} style={!mobile.has(linkName)?{}: {display:'flex'}}>
                    {linkName}
                  </MobileButton>
              )
            })}
            <Button onClick={handleLogout}>
              Logout
            </Button>
          </NavBarBox>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src={DefaultUserIcon} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
}
export default ResponsiveAppBar;