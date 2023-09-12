import Lottie from 'lottie-react'
import PageNotFoundAnimation from '../assets/lottie/page-not-found.json'
import { Typography } from "@mui/material";
import { styled } from '@mui/material/styles';
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';

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

const PageNotFound = () => {
  const navigate = useNavigate()
  
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(`/join`);
    }, 3000);
    
    return () => {
      clearTimeout(timer); 
    };
  }, []);
  
  return (
    <StyledDiv>
      <StyledTypography>Page not found! Redirecting to Join Screen...</StyledTypography>
      <StyledLottie animationData={PageNotFoundAnimation}/>
    </StyledDiv>
  )
}

export default PageNotFound