import { Box, Button, Grid, Paper } from "@mui/material";
import { ChangeEvent, ReactElement, useEffect, useState } from "react";
import { getRandom, wordbank } from '../../../public/wordbank'

import TextField from '@mui/material/TextField';
import socket from "../Websocket/socket";
import { styled } from '@mui/material/styles';

type MessageT = {
  author: {
    sessionId: string,
    username: string
  },
  message: string
} 

type ChatBoxPropsT = {
  roomName: string | null
}

const ChatContainer = styled(Box)(() =>({
  width: '90%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  backgroundColor: 'lightgrey',
  margin:'10px',
  marginTop:'5vh',
  marginLeft:'0px',
  borderRadius:'3%'
}))

const MessageBox = styled('div')(() => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  height:'80%'
}))

const MessageGrid = styled(Grid)(({ theme }) =>({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(1),
  width: '70%',
  margin: '3px', 
}))

const Message = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
}));

const Sender = styled(Paper)(({ theme }) => ({
  backgroundColor: 'lightblue',
  ...theme.typography.body2,
  width: "25%",
  height: "5px",
  textAlign: 'center',
  fontSize: '.6rem',
  border: 'none',
  padding: "5px",
}));

const StyledTextField = styled(TextField)(() => ({
  '& .MuiInputBase-input': {
    padding: '5px',
    backgroundColor:'white'
  },
}))

const Chatbox = ({ roomName }: ChatBoxPropsT): ReactElement => {
  const sessionId = sessionStorage.getItem('sessionId')
  const [messages, setMessages] = useState<MessageT[]>([])
  const [currentMessage, setCurrentMessage] = useState("")
  // const [gamewords, setGameWords] = useState<string[]>([])
  const [currWord, setCurrWord] = useState("")
  
  useEffect(()=>{
    const words = getRandom(5, wordbank)
    setCurrWord(words[Math.floor(Math.random()*words.length)])
    
    socket.on("message_to_client", ({author, message})=>{
      setMessages((prevMessages) =>{
        return [...prevMessages, {author, message}]
      })
    })
    
    return ()=>{
      socket.off("message_to_client")
    }
  },[])

  const handleCurrMessage = (ev: ChangeEvent<HTMLInputElement>)=>{
    const inputValue = ev.target.value
    setCurrentMessage(inputValue)
  }
  const handleSendMessage = () =>{
    if(currWord === currentMessage) console.log("We have a winner!!!")
    else{
      socket.emit("message_to_server", { author: {
        sessionId: sessionId, 
        username: socket.username
      }, message: currentMessage, roomName: roomName })
    }
    setCurrentMessage("")
  }
  
  return (
    <ChatContainer>
      <MessageBox>
        {messages.map((message, idx)=>{
          const isUserMessage = message.author.sessionId === sessionId
          const textAlign = isUserMessage ? 'right' : 'left'
          const alignSelf = isUserMessage ? 'end': 'start'
          return (
            <MessageGrid key={idx} sx={{
              textAlign: textAlign,
              alignSelf: alignSelf
            }}>
              <Message>{message.message}</Message>
              <Sender sx={{ alignSelf: alignSelf }}>{message.author.username}</Sender>
            </MessageGrid>
          )
        })}
      </MessageBox>
      <Grid>
        <StyledTextField value={currentMessage} onChange={handleCurrMessage} variant='outlined'/>
        <Button onClick={handleSendMessage}>Send Message</Button>
      </Grid>
    </ChatContainer>
  )
}

export default Chatbox;

