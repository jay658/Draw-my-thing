import { ChangeEvent, ReactElement, useEffect, useRef, useState } from "react";
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

import type { MessageT } from "./Types";
import type { Player } from '../WaitingRoom/Types';
import SendIcon from '@mui/icons-material/Send';
import socket from "../Websocket/socket";

type OwnPropsT = {
  roomName: string | null,
  currentWord?: string,
  drawer?: Player | null
}

const Chatbox = ({ roomName, currentWord='', drawer=null }: OwnPropsT): ReactElement => {
  const sessionId = sessionStorage.getItem('sessionId')
  const [messages, setMessages] = useState<MessageT[]>([])
  const [currentMessage, setCurrentMessage] = useState("")
  const playerName = useRef<string>('')
  
  useEffect(()=>{
    socket.on("message_to_client", ({author, message})=>{
      setMessages((prevMessages) =>{
        return [...prevMessages, {author, message}]
      })
    })

    socket.on('player_guessed_correct_word', (username) => {
      setMessages((prevMessages) => [...prevMessages, {author: "Server", message: `${username} guessed correctly!`}])
    })
    
    return ()=>{
      socket.off("message_to_client")
      socket.off('player_guessed_correct_word')
    }
  },[])

  useEffect(() => {
    if(drawer && drawer.username !== playerName.current) {
      playerName.current = drawer.username
      setMessages((prevMessages) => [...prevMessages, {author: "Server", message: `${playerName.current} is currently picking a word!`}])
    }
  }, [drawer])

  const handleCurrMessage = (ev: ChangeEvent<HTMLInputElement>)=>{
    const inputValue = ev.target.value
    setCurrentMessage(inputValue)
  }
  
  const handleSendMessage = () =>{
    if(currentWord === currentMessage.toLowerCase()){
      if(drawer?.sessionId === sessionId) setMessages([...messages, {author: "Server", message: `You can't guess your own word!!`}])
      else socket.emit('guessed_correct_word', roomName)
    }
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
            if(message.author === "Server"){
              return(
                <div key={idx} style={{color:'green'}}>{message.message}</div>
              )
            }else{
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
            }
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

