import { BsEraser, BsPencil } from "react-icons/bs";
import { ColorResult, CompactPicker } from 'react-color';
import { LinesT, SettingsT } from './Canvas'
import Select, { SelectChangeEvent } from '@mui/material/Select';

import Box from '@mui/material/Box';
import { Button } from "@mui/material";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from "@mui/material/MenuItem";
import { ReactElement } from "react"
import { styled } from '@mui/material'

type CanvasSettingsT = {
  setSettings: React.Dispatch<React.SetStateAction<SettingsT>>,
  settings: SettingsT,
  handleSettingChange: (e:SelectChangeEvent<unknown>) => void,
  setLines: React.Dispatch<React.SetStateAction<LinesT[]>>,
  handleRedo: () => void,
  handleUndo: () => void,
  handleClearHistory: () => void
}

const StyledSelect = styled(Select)(() => ({
  '&&.css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input': {
    padding: '8px 6px'
  },
}))

const PenWidthContainer = styled(Box)(() => ({
  minWidth: 70
}))

const ToolsContainer = styled(Box)(() => ({
  display:'flex', 
  flexDirection:'column'
}))

const StyledDiv = styled('div')(() => ({
  display: 'flex',
  justifyContent: 'center', 
  alignItems: 'center',
  gap: '10px',
  flexWrap: 'wrap'
}))

const StyledInputLabel = styled(InputLabel)(() => ({
  fontSize: '13px'
}))

const CanvasSettings = ({settings, setSettings, handleSettingChange, setLines, handleRedo, handleUndo, handleClearHistory}: CanvasSettingsT): ReactElement => {

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
      <CompactPicker color={stroke} onChange={(color:ColorResult) => {handleColorPickerClick(color.hex)}}/>
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
      <Button onClick={handleUndo}>Undo</Button>
      <Button onClick={handleRedo}>Redo</Button>
      <Button onClick={handleClear}>Clear</Button>
    </StyledDiv>
  )
}

export default CanvasSettings