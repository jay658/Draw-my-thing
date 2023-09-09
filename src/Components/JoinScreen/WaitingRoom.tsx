import { ReactElement, useEffect, useRef, useState } from "react";

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import ErrorMessages from "./ErrorMessage";
import { Grid } from "@mui/material";
import { MAX_ROOM_CAPACITY } from "./RoomList";
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { avatarsMap } from './AvatarSelect'
import socket from "../Websocket/socket";
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom'

type Player = {
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

const StyledCard = styled(Card)(() => ({
  borderRadius:'3%',
  width: '18vw',
  height: '100%',
  display:'flex',
  flexDirection: 'column',
  alignItems:' center',
  padding: '16px'
}))

const StyledSkeleton = styled(Skeleton)(() => ({
  borderRadius:'3%',
  width: '18vw',
  height: '100%',
  display:'flex',
  flexDirection: 'column',
  alignItems:' center',
  padding: '16px'
}))

const WaitingRoom = (): ReactElement => {
  const params = new URLSearchParams(window.location.search)
  const roomName = params.get("room")
  const [players, setPlayers] = useState<Player[]>([])
  const [currPlayer, setCurrPlayer] = useState<Player | null>(null)
  const [roomExists, setRoomExists] = useState(false)
  const [error, setError] = useState<WaitingRoomErrorsT>({
    playersNotReady: '',
  })
  const errorRef = useRef(error)
  const [openError, setOpenError] = useState(errorRef.current.playersNotReady? true: false)
  const navigate = useNavigate()
  
  useEffect(()=>{
    socket.emit("get_room", roomName)
    socket.emit("get_socket_info")
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
    
    socket.on("sending_socket_info", (player) => {
      setCurrPlayer(player)
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
    navigate(`/chatbox/${roomName}`)
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
          {populateScreen(players, currPlayer, readyUp).map(item => item)}
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

const populateScreen = (players: Player[], currPlayer: Player | null, readyUp: (idx:number) => void) => {
  const playerDetails = []
  for(let i = 0; i < MAX_ROOM_CAPACITY; i++){
    const player = players[i]
    playerDetails.push(
      i >= players.length? (<StyledSkeleton variant="rectangular" key={i}>
      </StyledSkeleton>):
      (<StyledCard key={i}>
          <Avatar alt={player.avatar} src={avatarsMap[player.avatar]}></Avatar>
          <CardContent>
            <Typography>
              Player {i +1}
            </Typography>
            <Typography>
              Name: {player.username}
            </Typography>
            <Typography>
              Ready Status: {player.readyStatus ? "Ready" : "Not Ready"}
            </Typography>
          </CardContent>
          {currPlayer && currPlayer.username === player.username && <CardActions>
            <Button size="small" onClick={()=> readyUp(i)}>Ready Up</Button>
          </CardActions>}
        </StyledCard>)
    )
  }
  return playerDetails
}