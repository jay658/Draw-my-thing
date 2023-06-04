import { ThemeProvider, createTheme } from '@mui/material/styles';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import GitHubMark from '../assets/github-mark.png'
import GitHubMarkInverted from '../assets/github-mark-inverted.png'
import GoogleGIcon from '../assets/google-g-icon.png'
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Paper from '@mui/material/Paper';
import { ReactElement } from 'react';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material'

type CopyrightType = {
  sx: {
    mt?: number
  }
}

const GoogleLoginButton = styled(Button)(() => ({
  marginTop: '10px',
  transition: 'background-color .3s, box-shadow .3s',
  padding: '12px 16px 12px 42px',
  border: 'none',
  borderRadius: '3px',
  boxShadow: '0 -1px 0 rgba(0, 0, 0, .04), 0 1px 1px rgba(0, 0, 0, .25)',
  color: '#757575',
  fontSize: '14px',
  fontWeight: '500',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Fira Sans","Droid Sans","Helvetica Neue",sans-serif',
  backgroundImage: `url(${GoogleGIcon})`,
  backgroundSize:'28px',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: '12px 11px',
  
  '&:hover': {
    boxShadow: '0 -1px 0 rgba(0, 0, 0, .04), 0 2px 4px rgba(0, 0, 0, .25)'
  },
}))

const GitHubLoginButton = styled(Button)(() => ({
  marginTop: '10px',
  transition: 'background-color .3s, box-shadow .3s',
  padding: '12px 16px 12px 42px',
  border: 'none',
  borderRadius: '3px',
  boxShadow: '0 -1px 0 rgba(0, 0, 0, .04), 0 1px 1px rgba(0, 0, 0, .25)',
  color: '#fff',
  fontSize: '14px',
  fontWeight: '500',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Fira Sans","Droid Sans","Helvetica Neue",sans-serif',
  backgroundImage: `url(${GitHubMarkInverted})`,
  backgroundSize:'20px',
  backgroundColor: '#000',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: '16px 14px',
  
  '&:hover': {
    boxShadow: '0 -1px 0 rgba(0, 0, 0, .04), 0 2px 4px rgba(0, 0, 0, .25)',
    color: '#000',
    backgroundImage: `url(${GitHubMark})`
  },
}))

function Copyright(props: CopyrightType) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignIn(): ReactElement {

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <GoogleLoginButton type="button" onClick={() => window.location.href ="/api/googleOauth"}>
              Sign in with Google
            </GoogleLoginButton>
            <GitHubLoginButton onClick={() => window.location.href ="/api/githubOauth"}>
              Sign in with GitHub
            </GitHubLoginButton>
            <Copyright sx={{ mt: 5 }} />
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}