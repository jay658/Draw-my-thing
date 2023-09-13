import { Box, Button, Grid, Paper } from "@mui/material";

import ScrollToBottom from 'react-scroll-to-bottom';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';

const ChatContainer = styled(Box)(() =>({
  width: '95%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  backgroundColor: '#EAEAEA',
  margin:'10px',
  marginTop:'5vh',
  marginLeft:'0px',
  borderRadius:'3%',
  padding: '5px'
}))

const StyledScrollToBottom = styled(ScrollToBottom)(() => ({
  height: '100%',
  width: '100%',
  '& > div': {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    overflowY: 'auto',
    position: 'relative',
    '&::before': {
      content: '""',
      flexGrow: 1,
    },
  }
}))

const MessageBox = styled('div')(() => ({
  width: '100%',
  height:'85%',
}))

const MessageGrid = styled(Grid)(({ theme }) =>({
  maxWidth:'70%',
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(1),
  margin: '3px', 
  overflowWrap: 'break-word',
  wordBreak: 'break-all',
  textAlign: 'left'
}))

const Message = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
}));

const Sender = styled(Paper)(({ theme }) => ({
  backgroundColor: 'lightblue',
  ...theme.typography.body2,
  height: "5px",
  textAlign: 'center',
  fontSize: '.6rem',
  border: 'none',
  padding: "5px",
}));

const TextBoxContainer = styled(Grid)(() => ({
  display: 'flex',
  padding:'0px 10px'
}))

const StyledTextField = styled(TextField)(() => ({
  '& .MuiInputBase-input': {
    padding: '5px',
    backgroundColor: 'white',
  },
  flex:'0 0 80%'
}))

const SendMessageButton = styled(Button)(() => ({
  padding: '5px',
  flex: '0 0 20%',
  minWidth: '0px'
}))

export {
  ChatContainer,
  StyledScrollToBottom,
  MessageBox,
  MessageGrid,
  Message,
  Sender,
  TextBoxContainer,
  StyledTextField,
  SendMessageButton
}