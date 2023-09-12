import { StyledButton, StyledDiv } from './StyledComponents';
import { useEffect, useState } from 'react'

import ColorSlider from './VolumeSlider'
import IntroMusic from '../../assets/intro-music.mp3'
import Lottie from 'lottie-react'
import MusicOnOff from '../../assets/lottie/music-on-off.json'
import ReactHowler from 'react-howler'

const MusicPlayer = () => {
  const [musicPlaying, setMusicPlaying] = useState(false)
  const [volume, setVolume] = useState(0)
  
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
      <StyledButton onClick={handleToggleMusic}>{musicPlaying && volume > 0? 
        <Lottie animationData={MusicOnOff} initialSegment={[35, 100]}/>:
        <Lottie animationData={MusicOnOff} initialSegment={[80, 150]} loop={false}/>
      }</StyledButton>
      <ReactHowler src={IntroMusic} playing={musicPlaying} loop={true} volume={volume}/>
    </StyledDiv>
  )
}

export default MusicPlayer