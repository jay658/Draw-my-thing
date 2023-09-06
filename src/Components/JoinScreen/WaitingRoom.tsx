import { ReactElement, useEffect, useRef, useState } from "react";

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { Grid } from "@mui/material";
import Typography from '@mui/material/Typography';
import socket from "../Websocket/socket";

type Player = {
  username: string,
  readyStatus: boolean
} 
const WaitingRoom = (): ReactElement => {
  const params = new URLSearchParams(window.location.search)
  const roomName = params.get("room")
  const [players, setPlayers] = useState<Player[]>([])
  const [roomExists, setRoomExists] = useState(false)
  
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
    
    return ()=>{
      socket.off("send_room")
      socket.off("status_updated")
    }
  },[])
  
  const readyUp =(idx: number)=>{
    const username = players[idx].username
    socket.emit("update_status", {username, roomName})
  }
  if(!roomExists) return <div>No game found</div>
  
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
    </Grid>
  )
}

export default WaitingRoom;

