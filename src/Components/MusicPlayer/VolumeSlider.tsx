import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material'

type ColorSliderPropsT = {
  volume: number,
  setVolume: React.Dispatch<React.SetStateAction<number>>
}

const StyledBox = styled(Box)(() => ({
  width: '100px'
}))

export default function ColorSlider({volume, setVolume}: ColorSliderPropsT) {

  const handleChangeVolume = (_e: Event, value: number | number[]) => {
    if(typeof value === 'number') setVolume(value)
  }
  
  return (
    <StyledBox>
      <Slider
        aria-label="Volume"
        defaultValue={volume}
        min={0}
        max={1}
        step={0.01}
        color="primary"
        onChange={handleChangeVolume}
      />
    </StyledBox>
  );
}