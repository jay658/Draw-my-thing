import { Box } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import { Stage } from 'react-konva';
import { styled } from '@mui/material'

/* CANVAS COMPONENTS */
const StyledStage = styled(Stage)(() => ({
  border: '1px solid black', 
  touchAction:'none'
}))

/* CANVAS SETTINGS COMPONENTS */
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

export {
  /* CANVAS SETTINGS COMPONENTS */
  StyledStage,
  /* CANVAS SETTINGS COMPONENTS */
  StyledSelect,
  PenWidthContainer,
  ToolsContainer,
  StyledDiv,
  StyledInputLabel
}