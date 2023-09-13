import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

/* JOIN SCREEN COMPONENTS*/
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(3),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  width: '100vw',
  maxWidth: '600px',
  border: '1px solid black',
}));

const InLineContainer = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}));

const InnerGrid = styled(Grid)(() => ({
  justifyContent:'center',
  alignItems:'center'
}))

const OutterGrid = styled(Grid)(() => ({
  display: 'flex', 
  justifyContent: 'center', 
  alignItems: 'center', 
  height: '80vh'
}))

/* AVATAR SELECT COMPONENTS */
const StyledFormControl = styled(FormControl)(() => ({
  margin: '10px',
  width:'8vw',
  minWidth: '75px',
  maxWidth: '100px'
}))

export {
  /* JOIN SCREEN COMPONENTS */
  Item, 
  InLineContainer,
  InnerGrid,
  OutterGrid,

  /*AVATAR SELECT COMPONENTS */
  StyledFormControl,
}