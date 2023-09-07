import { ReactElement, useEffect, useRef, useState } from "react";

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import ErrorMessages from "./ErrorMessage";
import { Grid } from "@mui/material";
import Typography from '@mui/material/Typography';
import socket from "../Websocket/socket";
import { useNavigate } from 'react-router-dom'

type Player = {
  username: string,
  readyStatus: boolean
} 

export type WaitingRoomErrorsT = {
  playersNotReady: string
}

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
    }
  },[])
  
  const startGame = () => {
    socket.emit("check_if_everyone_is_ready", roomName)
  }
  
  const readyUp =(idx: number)=>{
    const username = players[idx].username
    socket.emit("update_status", {username, roomName})
  }
  
  if(!roomExists) return <div>There is no room with the name {roomName}</div>
  
  return (
    <Grid container spacing={4} justifyContent={"center"} alignItems={"center"}>
      {players.map((player, idx)=>{
        return (
          <Card sx={{ minWidth: 275 }} key={idx}>
            <CardContent>
              <Typography>
                Player {idx +1}
              </Typography>
              <Typography>
                Name: {player.username}
              </Typography>
              <Typography>
                Ready Status: {player.readyStatus ? "Ready" : "Not Ready"}
              </Typography>
            </CardContent>
            {socket.username === player.username && <CardActions>
              <Button size="small" onClick={()=> readyUp(idx)}>Ready Up</Button>
            </CardActions>}
          </Card>
        )
      })}
      <Button onClick={startGame}>Start game</Button>
      <ErrorMessages openError={openError} setOpenError={setOpenError} error={errorRef.current}/>
    </Grid>
  )
}

export default WaitingRoom;

