import { BsEraser, BsPencil } from "react-icons/bs";
import { ColorResult, GithubPicker } from 'react-color';
import { LinesT, SettingsT } from './Types'
import {
  PenWidthContainer,
  StyledDiv,
  StyledInputLabel,
  StyledSelect,
  ToolsContainer
} from './StyledComponents'

import { Button } from "@mui/material";
import FormControl from '@mui/material/FormControl';
import MenuItem from "@mui/material/MenuItem";
import { ReactElement } from "react"
import { SelectChangeEvent } from '@mui/material/Select';

type OwnPropsT = {
  setSettings: React.Dispatch<React.SetStateAction<SettingsT>>,
  settings: SettingsT,
  handleSettingChange: (e:SelectChangeEvent<unknown>) => void,
  setLines: React.Dispatch<React.SetStateAction<LinesT[]>>,
  handleRedo: () => void,
  handleUndo: () => void,
  handleClearHistory: () => void
}

const colors = [
  "#000000", // Black
  "#808080", // Gray
  "#A9A9A9", // Dark Gray
  "#D3D3D3", // Light Gray
  "#FFFFFF", // White
  "#FF0000", // Red
  "#FFA500", // Orange
  "#FFFF00", // Yellow
  "#808000", // Olive
  "#00FF00", // Green
  "#008080", // Teal
  "#00FFFF", // Cyan
  "#0000FF", // Blue
  "#800080", // Purple
  "#FF00FF", // Magenta
  "#800000"  // Maroon
];

const CanvasSettings = ({settings, setSettings, handleSettingChange, setLines, handleRedo, handleUndo, handleClearHistory}: OwnPropsT): ReactElement => {

  const { stroke, tool, strokeWidth } = settings
  const handleToolClick = (tool:string) => {
    setSettings({...settings, tool})
  }

  const handleColorPickerClick = (hex: string) => {
    setSettings({...settings, stroke: hex})
  }

  const handleClear = () => {
    handleClearHistory()
    setLines([])
  }
  
  return (
    <StyledDiv>
      {/*Can use the width property to make this vertical. Can also change the box sizes to fit mobile better. */}
      <GithubPicker color={stroke} onChange={(color:ColorResult) => {handleColorPickerClick(color.hex)}} colors={colors}/>
      <ToolsContainer>
        <Button 
          sx={{'border':tool === 'pen'? '1px solid black': ''}}
          onClick={() => handleToolClick('pen')}>
          <BsPencil/>
        </Button>

        <Button 
          sx={{'border':tool === 'eraser'? '1px solid black': ''}}
          onClick={() => handleToolClick('eraser')}>
          <BsEraser/>
        </Button>
      </ToolsContainer>
      <PenWidthContainer>
        <FormControl fullWidth>
          <StyledInputLabel>Pen Width</StyledInputLabel>
          <StyledSelect
            name={'strokeWidth'}
            value={`${strokeWidth}`}
            label={'Pen Width'}
            onChange={handleSettingChange}
          >
            <MenuItem value={'1'}>XS</MenuItem>
            <MenuItem value={'5'}>S</MenuItem>
            <MenuItem value={'10'}>M</MenuItem>
            <MenuItem value={'20'}>L</MenuItem>
            <MenuItem value={'50'}>XL</MenuItem>
          </StyledSelect>
        </FormControl>
      </PenWidthContainer>
      <div style={{display:'flex', flexDirection:'column'}}>
        <Button onClick={handleUndo}>Undo</Button>
        <Button onClick={handleRedo}>Redo</Button>
      </div>
      <Button onClick={handleClear}>Clear</Button>
    </StyledDiv>
  )
}

export default CanvasSettings