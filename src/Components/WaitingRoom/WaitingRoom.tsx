import { ChatBoxContainer, InnerGrid, OutterGrid, PlayersInfoContainer, WaitingRoomContainer } from './StyledComponents'
import { ReactElement, useEffect, useState } from "react";

import Button from '@mui/material/Button';
import Chatbox from "../Chat/Chatbox";
import CircularProgress from '@mui/material/CircularProgress';
import ErrorMessages from "../ErrorMessages/ErrorMessage";
import PageNotFound from "../PageNotFound/PageNotFound";
import { Player } from './Types'
import PopulateWaitingScreen from './PopulateWaitingRoom';
import socket from "../Websocket/socket";
import { useNavigate } from 'react-router-dom'

const WaitingRoom = (): ReactElement => {
  const params = new URLSearchParams(window.location.search)
  const roomName = params.get("room")
  const sessionId = sessionStorage.getItem('sessionId')
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [roomExists, setRoomExists] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [openError, setOpenError] = useState(false)
  const navigate = useNavigate()
  
  useEffect(()=>{
    const finalizeLoading = (exists: boolean) => {
      setRoomExists(exists);
      setLoading(false);
    };
    
    if(!socket.connected && sessionId){
      socket.connect()
      socket.emit('restore_waiting_room_session', sessionId, (response: 'success' | 'failed', userInfo: { username: string, avatar: string, roomName: string}) => {
        if(response === 'failed') {
          socket.disconnect()
          navigate('/join')
        }
        if(response === 'success'){ 
          if(userInfo){
            const { username, avatar, roomName } = userInfo
            socket.username = username
            socket.avatar = avatar
            socket.roomName = roomName
          }
          socket.emit("get_room", roomName)
        }
      })
    }
    else if(!socket.connected && !sessionId){
      navigate('/join')
    } else {
      socket.emit("get_room", roomName)
    }
    
    socket.on("send_room", (room)=>{
      if(room){
        if(!roomExists) setRoomExists(true)
        setPlayers([...room.members])
      }
      finalizeLoading(!!room)
    })
    
    socket.on("status_updated", (members)=>{
      setPlayers(members)
    })

    socket.on("starting_game", () => {
      navigate(`/game?room=${roomName}`)
    })

    socket.on("players_not_ready", (data) => {
      setOpenError(true)
      setError(data)
    })

    socket.on("player_left", ({ sessionId }) => {
      setPlayers((prevPlayers) => {
        return prevPlayers.filter(player => player.sessionId !== sessionId)
      })
    })
    
    return ()=>{
      socket.off("send_room")
      socket.off("status_updated")
      socket.off("starting_game")
      socket.off("players_not_ready")
      socket.off("sending_socket_info")
      socket.off("player_left")
    }
  },[])
  
  const startGame = () => {
    socket.emit("check_if_everyone_is_ready", roomName)
  }
  
  const readyUp =()=>{
    socket.emit("update_status", { sessionId, roomName })
  }

  const backToJoinScreen = () => {
    socket.emit('leave_room')
    navigate(`/loading?redirect=/join`)
  }
  
  if(loading) return <CircularProgress/>
  if(!roomExists) return <PageNotFound/>
  
  return (
    <WaitingRoomContainer>
      <PlayersInfoContainer>
        <OutterGrid container>
          <InnerGrid>
            <PopulateWaitingScreen players={players} readyUp={readyUp}/>
          </InnerGrid>
        </OutterGrid>
        <div>
          <Button onClick={backToJoinScreen}>Back to join screen</Button>
          <Button onClick={startGame}>Start game</Button>
        </div>
        <ErrorMessages openError={openError} setOpenError={setOpenError} error={error}/>
      </PlayersInfoContainer>
      <ChatBoxContainer>
        <Chatbox roomName={roomName}/>
      </ChatBoxContainer>
    </WaitingRoomContainer>
  )
}

export default WaitingRoom;