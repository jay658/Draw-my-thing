import { ChangeEvent, ReactElement, useEffect, useState } from "react";
import {
  ChatContainer,
  Message,
  MessageBox,
  MessageGrid,
  SendMessageButton,
  Sender,
  StyledScrollToBottom,
  StyledTextField,
  TextBoxContainer
} from './StyledComponents'
import { getRandom, wordbank } from '../../../public/wordbank'

import type { MessageT } from "./Types";
import SendIcon from '@mui/icons-material/Send';
import socket from "../Websocket/socket";

type OwnPropsT = {
  roomName: string | null
}

const Chatbox = ({ roomName }: OwnPropsT): ReactElement => {
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === 'Enter') handleSendMessage()
  }
  
  return (
    <ChatContainer>
      <MessageBox>
        <StyledScrollToBottom>
          {messages.map((message, idx)=>{
            const isUserMessage = message.author.sessionId === sessionId
            const alignSelf = isUserMessage ? 'end': 'start'
            return (
              <MessageGrid key={idx} sx={{
                alignSelf: alignSelf
              }}>
                <Message>{message.message}</Message>
                <Sender sx={{ alignSelf: alignSelf }}>{message.author.username}</Sender>
              </MessageGrid>
            )
          })}
        </StyledScrollToBottom>
      </MessageBox>
      <TextBoxContainer>
        <StyledTextField variant='outlined' placeholder={'Send a message'} value={currentMessage} onChange={handleCurrMessage} onKeyDown={handleKeyDown}/>
        <SendMessageButton onClick={handleSendMessage}><SendIcon/></SendMessageButton>
      </TextBoxContainer>
    </ChatContainer>
  )
}

export default Chatbox;

