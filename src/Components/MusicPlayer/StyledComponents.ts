import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { mq } from '../NavBar/NavBar';
import { styled } from '@mui/material'

/* MUSIC PLAYER COMPONENTS */
const StyledDiv = styled('div')(() => ({
  display:'flex', 
  justifyContent:'flex-end', 
  alignItems:'center'
}))

const StyledButton = styled(Button)(() => ({
  width:'3vw', 
  maxWidth:'50px', 
  maxHeight:'20px', 
  margin: '10px'
}))

/* VOLUME SLIDER COMPONENTS */
const StyledBox = styled(Box)(() => ({
  width: '100px',
  [mq.mobile]:{
    display: 'none'
  }
}))

export {
  /* MUSIC PLAYER COMPONENTS */
  StyledDiv,
  StyledButton,
  
  /* VOLUME SLIDER COMPONENTS */
  StyledBox,
}