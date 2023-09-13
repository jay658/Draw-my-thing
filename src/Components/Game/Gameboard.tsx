import { useEffect, useState } from 'react';

import { Button } from '@mui/base';
import Canvas from '../Canvas/Canvas';
import Chatbox from '../Chat/Chatbox';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import PageNotFound from '../PageNotFound/PageNotFound';
import type { Player } from '../WaitingRoom/Types';
import ScoreBoard from '../ScoreBoard/ScoreBoard';
import { Typography } from '@mui/material';
import socket from '../Websocket/socket';

const GameBoard = () => {
  const params = new URLSearchParams(window.location.search)
  const roomName = params.get("room")
  const [players, setPlayers] = useState<Player[]>([])
  const [drawerIdx, setDrawerIdx] = useState(0)
  const [roomExists, setRoomExists] = useState(false)
  const [loading, setLoading] = useState(true)
  const [turn, setTurn] = useState(1)

  useEffect(() => {
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
          finalizeLoading(false)
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
    }else {
      socket.emit("get_room", roomName)
    }
    
    socket.on("send_room", (room)=>{
      if(room){
        if(!roomExists) setRoomExists(true)
        setPlayers([...room.members])
      }
      finalizeLoading(!!room)
    })

    return () => {
      socket.off("send_room")
    }
  }, [])

  const handleNextDrawer = () => {
    if(drawerIdx >= players.length - 1) {
      setDrawerIdx(0)
      setTurn(turn + 1)
    }
    else setDrawerIdx(drawerIdx + 1)
  }

  if(loading) return <CircularProgress/>
  if(!roomExists) return <PageNotFound/>
  
  return (
    <Grid style={{display:'flex'}}>
      <Grid style={{flex:'0 0 15%'}}>
        <ScoreBoard players={players} drawer={players[drawerIdx]}/>
      </Grid>
      <Grid style={{flex:'0 0 60%'}}>
        {/* Word shower here. Maybe also the timer */}
        <Canvas drawerSessionId={players[drawerIdx].sessionId}/>
        <Typography>Turn: {turn}</Typography>
        <Button onClick={handleNextDrawer}>Next drawer</Button>
      </Grid>
      <Grid style={{flex:'0 0 25%'}}>
        <Chatbox roomName={roomName}/>
      </Grid>
    </Grid>
  )
}

export default GameBoard