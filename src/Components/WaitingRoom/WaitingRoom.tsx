import { ChatBoxContainer, InnerGrid, OutterGrid, PlayersInfoContainer, WaitingRoomContainer } from './StyledComponents'
import { Player, WaitingRoomErrorsT } from './Types'
import { ReactElement, useEffect, useRef, useState } from "react";

import Button from '@mui/material/Button';
import Chatbox from "../Chat/Chatbox";
import CircularProgress from '@mui/material/CircularProgress';
import ErrorMessages from "../ErrorMessages/ErrorMessage";
import PageNotFound from "../PageNotFound/PageNotFound";
import PopulateWaitingScreen from './PopulateWaitingRoom';
import socket from "../Websocket/socket";
import { useNavigate } from 'react-router-dom'

const WaitingRoom = (): ReactElement => {
  const params = new URLSearchParams(window.location.search)
  const roomName = params.get("room")
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [roomExists, setRoomExists] = useState(false)
  const [error, setError] = useState<WaitingRoomErrorsT>({
    playersNotReady: '',
  })
  const errorRef = useRef(error)
  const [openError, setOpenError] = useState(errorRef.current.playersNotReady? true: false)
  const navigate = useNavigate()
  
  useEffect(()=>{
    const sessionId = sessionStorage.getItem('sessionId')

    const finalizeLoading = (exists: boolean) => {
      setRoomExists(exists);
      setLoading(false);
    };
    
    if(!socket.connected && sessionId){
      socket.connect()
      socket.emit('restore_session', sessionId, (response: 'success' | 'failed', userInfo: { username: string, avatar: string, roomName: string}) => {
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
  
  const readyUp =(idx: number)=>{
    const username = players[idx].username
    socket.emit("update_status", {username, roomName})
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
        <ErrorMessages openError={openError} setOpenError={setOpenError} error={errorRef.current}/>
      </PlayersInfoContainer>
      <ChatBoxContainer>
        <Chatbox roomName={roomName}/>
      </ChatBoxContainer>
    </WaitingRoomContainer>
  )
}

export default WaitingRoom;