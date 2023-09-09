import { ChangeEvent, ReactElement, useEffect, useState } from "react";

import { Button } from "@mui/material";
import socket from "../Websocket/socket";

type MessageT = {
  author: string,
  message: string
} 
const Chatbox = (): ReactElement => {
  const params = new URLSearchParams(window.location.search)
  const roomName = params.get("room")
  const [messages, setMessages] = useState<MessageT[]>([])
  const [roomExists, setRoomExists] = useState(false)
  const [currentMessage, setCurrentMessage] = useState("")
  
  useEffect(()=>{
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
    socket.emit("message_to_server", { author: socket.username, message: currentMessage, roomName: roomName })
    setCurrentMessage("")
  }
  
  if(!roomExists) return <div>There is no room with the name {roomName}</div>
  
  return (
    <div>
      {messages.map((message, idx)=>{
        return (
          <li key={idx}>
            {message.author} sent: {message.message}
          </li>
        )
      })}
      <input value={currentMessage} onChange={handleCurrMessage}></input>
      <Button onClick={handleSendMessage}>Send Message</Button>
    </div>
  )
}

export default Chatbox;

