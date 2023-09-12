import Lottie from 'lottie-react'
import { Typography } from "@mui/material";
import { styled } from '@mui/material/styles';

const StyledDiv = styled('div')(() => ({
  height:'80vh', 
  padding:'20px', 
  display: 'flex', 
  justifyContent: 'space-around', 
  alignItems: 'center', 
  flexDirection: 'column'
}))

const StyledTypography = styled(Typography)(() => ({
  fontSize:'24px'
}))

const StyledLottie = styled(Lottie)(() => ({
  height: '70%'
}))

export {
  StyledDiv,
  StyledTypography,
  StyledLottie,
}