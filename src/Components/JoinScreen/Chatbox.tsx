import { Box, Button, Grid, Paper } from "@mui/material";
import { ChangeEvent, ReactElement, useEffect, useState } from "react";
import { getRandom, wordbank } from '../../../public/wordbank'

import socket from "../Websocket/socket";
import { styled } from '@mui/material/styles';

type MessageT = {
  author: string,
  message: string
} 
const ChatContainer = styled(Box)(() =>({
  width: '30vw',
  // height: '70vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  backgroundColor: 'lightgrey'
}))

const MessageGrid = styled(Grid)(({ theme }) =>({
  padding: theme.spacing(1),
  width: '70%',
  margin: '3px', 
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
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
  padding: "5px"
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
      socket.emit("message_to_server", { author: socket.username, message: currentMessage, roomName: roomName })
    }
    setCurrentMessage("")
  }
  
  if(!roomExists) return <div>There is no room with the name {roomName}</div>
  
  return (
    <ChatContainer>
      {messages.map((message, idx)=>{
        const isUserMessage = message.author === socket.username
        const textAlign = isUserMessage ? 'left' : 'right'
        const alignSelf = isUserMessage ? 'start': 'end'
        return (
          <MessageGrid key={idx} sx={{
            textAlign: textAlign,
            alignSelf: alignSelf
          }}>
            <Message>{message.message}</Message>
            <Sender sx={{alignSelf: alignSelf}}>{message.author}</Sender>
          </MessageGrid>
        )
      })}
      <Grid>
        <input value={currentMessage} onChange={handleCurrMessage}></input>
        <Button onClick={handleSendMessage}>Send Message</Button>
      </Grid>
    </ChatContainer>
  )
}

export default Chatbox;

