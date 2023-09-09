import { ReactElement, useEffect, useRef, useState } from "react";

import Button from '@mui/material/Button';
import ErrorMessages from "./ErrorMessage";
import { Grid } from "@mui/material";
import PopulateWaitingScreen from './PopulateWaitingRoom';
import socket from "../Websocket/socket";
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom'

export type Player = {
  id: string,
  username: string,
  readyStatus: boolean,
  avatar: string
} 

export type WaitingRoomErrorsT = {
  playersNotReady: string
}

const OutterGrid = styled(Grid)(() => ({
  paddingTop: '40px',
  margin: '0px',
  justifyContent: 'flex-start',
  flexDirection: 'column',
  height: '80vh',
}))

const InnerGrid = styled(Grid)(() => ({
  display: 'flex', 
  justifyContent: 'center', 
  alignItems: 'stretch',
  flexWrap: 'wrap', 
  height: '40%',
  gap: 'calc(100vw * 0.02)',
}))

const Container = styled('div')(() => ({
  display: 'flex', 
  flexDirection:'column', 
  height: '90vh', 
  alignItems:'center'
}))

const WaitingRoom = (): ReactElement => {
  const params = new URLSearchParams(window.location.search)
  const roomName = params.get("room")
  const [players, setPlayers] = useState<Player[]>([])
  const [roomExists, setRoomExists] = useState(false)
  const [error, setError] = useState<WaitingRoomErrorsT>({
    playersNotReady: '',
  })
  const errorRef = useRef(error)
  const [openError, setOpenError] = useState(errorRef.current.playersNotReady? true: false)
  const navigate = useNavigate()
  
  useEffect(()=>{
    socket.emit("get_room", roomName)
    socket.on("send_room", (room)=>{
      if(room){
        if(!roomExists) setRoomExists(true)
        setPlayers([...room.members])
      }
    })
    
    socket.on("status_updated", (room)=>{
      setPlayers(room.members)
    })

    socket.on("starting_game", () => {
      navigate(`/game?room=${roomName}`)
    })

    socket.on("players_not_ready", (data) => {
      setOpenError(true)
      setError(_prevError => {
        const newError = { playersNotReady: data }
        errorRef.current = newError
        return newError
      })
    })
    
    return ()=>{
      socket.off("send_room")
      socket.off("status_updated")
      socket.off("starting_game")
      socket.off("players_not_ready")
      socket.off("sending_socket_info")
    }
  },[])
  
  const startGame = () => {
    socket.emit("check_if_everyone_is_ready", roomName)
  }
  const goToChat = () =>{
    navigate(`/chatbox?room=${roomName}`)
  }
  
  const readyUp =(idx: number)=>{
    const username = players[idx].username
    socket.emit("update_status", {username, roomName})
  }

  const backToJoinScreen = () => {
    socket.emit('leave_room')
    navigate('/join')
  }
  
  if(!roomExists) return <div>There is no room with the name {roomName}</div>
  
  return (
    <Container>
      <OutterGrid container>
        <InnerGrid>
          <PopulateWaitingScreen players={players} readyUp={readyUp}/>
        </InnerGrid>
      </OutterGrid>
      <div>
        <Button onClick={backToJoinScreen}>Back to join screen</Button>
        <Button onClick={startGame}>Start game</Button>
        <Button onClick={goToChat}>Go to Chat</Button>
      </div>
      <ErrorMessages openError={openError} setOpenError={setOpenError} error={errorRef.current}/>
    </Container>
  )
}

export default WaitingRoom;