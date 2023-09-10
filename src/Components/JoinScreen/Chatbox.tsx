import { Box, Button, Grid, Paper } from "@mui/material";
import { ChangeEvent, ReactElement, useEffect, useState } from "react";
import { getRandom, wordbank } from '../../../public/wordbank'

import socket from "../Websocket/socket";
import { styled } from '@mui/material/styles';

type MessageT = {
  author: {
    id: string,
    username: string
  },
  message: string
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


const Chatbox = (): ReactElement => {
  const params = new URLSearchParams(window.location.search)
  const roomName = params.get("room")
  const [messages, setMessages] = useState<MessageT[]>([])
  const [roomExists, setRoomExists] = useState(false)
  const [currentMessage, setCurrentMessage] = useState("")
  // const [gamewords, setGameWords] = useState<string[]>([])
  const [currWord, setCurrWord] = useState("")
  
  useEffect(()=>{
    const words = getRandom(5, wordbank)
    setCurrWord(words[Math.floor(Math.random()*words.length)])
    console.log(currWord)
    socket.emit("get_room", roomName)
    socket.on("send_room", (room)=>{
      if(room){
        if(!roomExists) setRoomExists(true)
      }
    })
    socket.on("message_to_client", ({author, message})=>{
      setMessages((prevMessages) =>{
        return [...prevMessages, {author, message}]
      })
    })
    
    return ()=>{
      socket.off("message_to_client")
      socket.off("send_room")
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
        id:socket.id, 
        username: socket.username
      }, message: currentMessage, roomName: roomName })
    }
    setCurrentMessage("")
  }
  
  if(!roomExists) return <div>There is no room with the name {roomName}</div>
  
  return (
    <ChatContainer>
      <MessageBox>
        {messages.map((message, idx)=>{
          const isUserMessage = message.author.id === socket.id
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
        <input value={currentMessage} onChange={handleCurrMessage}></input>
        <Button onClick={handleSendMessage}>Send Message</Button>
      </Grid>
    </ChatContainer>
  )
}

export default Chatbox;

