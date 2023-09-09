import Lottie, { LottieRefCurrentProps } from 'lottie-react'
import { useEffect, useRef } from "react";

import DifferentObjectsAnimation from '../../assets/lottie/different-objects-animation.json'
import LoadingAnimation from '../../assets/lottie/loading-animation.json'
import { useNavigate } from 'react-router-dom';

const LoadingScreen = () => {
  const params = new URLSearchParams(window.location.search)
  const roomName = params.get("room")
  console.log(params, roomName)
  const differentAnimationsRef = useRef<LottieRefCurrentProps>(null)
  const loadingAnimationRef = useRef<LottieRefCurrentProps>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(`/waitingroom?room=${roomName}`);
    }, 2000);
    
    return () => {
      clearTimeout(timer); 
    };
  }, []);
  
  return(
    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
      <Lottie lottieRef={loadingAnimationRef} animationData={LoadingAnimation} style={{width: '50%'}}/>
      <Lottie lottieRef={differentAnimationsRef} animationData={DifferentObjectsAnimation} style={{width: '20%'}}/>
    </div>
  )
}

export default LoadingScreen