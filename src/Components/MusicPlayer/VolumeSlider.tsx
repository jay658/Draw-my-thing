import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { mq } from '../NavBar';
import { styled } from '@mui/material'
import { useState } from 'react';

type ColorSliderPropsT = {
  volume: number,
  setVolume: React.Dispatch<React.SetStateAction<number>>
}

const StyledBox = styled(Box)(() => ({
  width: '100px',
  [mq.mobile]:{
    display: 'none'
  }
}))

export default function ColorSlider({volume, setVolume}: ColorSliderPropsT) {
  const [sliderValue, setSliderValue] = useState(volume);

  const handleChangeVolume = (_e: Event, value: number | number[]) => {
    if(typeof value === 'number') {
      setSliderValue(value)
      setVolume(value)
    }
  }
  
  return (
    <StyledBox>
      <Slider
        aria-label="Volume"
        value={sliderValue}
        min={0}
        max={1}
        step={0.01}
        color="primary"
        onChange={handleChangeVolume}
      />
    </StyledBox>
  );
}