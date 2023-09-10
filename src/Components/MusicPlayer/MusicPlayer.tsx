import { useEffect, useState } from 'react'

import Button from '@mui/material/Button';
import ColorSlider from './VolumeSlider'
import IntroMusic from '../../assets/intro-music.mp3'
import Lottie from 'lottie-react'
import MusicOnOff from '../../assets/lottie/music-on-off.json'
import ReactHowler from 'react-howler'
import { styled } from '@mui/material'

const StyledDiv = styled('div')(() => ({
  display:'flex', 
  justifyContent:'flex-end', 
  alignItems:'center'
}))

const StyledButton = styled(Button)(() => ({
  width:'3vw', 
  maxWidth:'50px', 
  maxHeight:'20px', 
  margin: '20px'
}))

const MusicPlayer = () => {
  const [musicPlaying, setMusicPlaying] = useState(false)
  const [volume, setVolume] = useState(1)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setMusicPlaying(true)
    }, 1000);
    
    return () => {
      clearTimeout(timer); 
    };
  }, [])

  const handleToggleMusic = () => {
    setMusicPlaying((prevMusicPlaying) => !prevMusicPlaying)
  }
  
  return(
    <StyledDiv>
      <ColorSlider volume={volume} setVolume={setVolume}/>
      <StyledButton onClick={handleToggleMusic}>{musicPlaying? 
        <Lottie animationData={MusicOnOff} initialSegment={[35, 100]}/>:
        <Lottie animationData={MusicOnOff} initialSegment={[80, 150]} loop={false}/>
      }
      </StyledButton>
      <ReactHowler src={IntroMusic} playing={musicPlaying} loop={true} volume={volume}/>
    </StyledDiv>
  )
}

export default MusicPlayer

/*
<Lottie lottieRef={readyAnimation} loop={player.readyStatus? false: true} animationData={ReadyAnimation} initialSegment={player.readyStatus? [30, 100]: [0, 30]} style={{height:'50%'}}/>
*/