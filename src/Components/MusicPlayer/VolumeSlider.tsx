import Slider from '@mui/material/Slider';
import { StyledBox } from './StyledComponents';
import { useState } from 'react';

type OwnPropsT = {
  volume: number,
  setVolume: React.Dispatch<React.SetStateAction<number>>
}

export default function ColorSlider({volume, setVolume}: OwnPropsT) {
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