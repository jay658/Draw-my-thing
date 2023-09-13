import {
  StyledDiv,
  StyledLottie,
  StyledTypography,
} from './StyledComponents'

import PageNotFoundAnimation from '../../assets/lottie/page-not-found.json'
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';

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