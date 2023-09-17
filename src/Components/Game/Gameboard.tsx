import { useEffect, useState } from 'react';

import { Button } from '@mui/base';
import Canvas from './Canvas/Canvas';
import Chatbox from '../Chat/Chatbox';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import PageNotFound from '../PageNotFound/PageNotFound';
import type { Player } from '../WaitingRoom/Types';
import ScoreBoard from './ScoreBoard/ScoreBoard';
import { Typography } from '@mui/material';
import WordDisplay from './WordDisplay/WordDisplay';
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
      //socket.emit("get_game_info", roomName)
      socket.emit("get_room", roomName)
    }
    
    //socket.on("send_game_info_to_client", gameinfo)
    //gameinfo is the game class object
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
    <Grid container sx={{height:'85vh'}}>
      <Grid item xs={2} sx={{height: '100%'}}>
        <ScoreBoard players={players} drawer={players[drawerIdx]}/>
      </Grid>
      <Grid item xs={7.5} sx={{height: '100%'}}>
        <WordDisplay word={ 'Suez Canal' }/>
        <Canvas drawerSessionId={players[drawerIdx].sessionId} roomName={roomName}/>
        <Typography>Turn: {turn}</Typography>
        <Button onClick={handleNextDrawer}>Next drawer</Button>
      </Grid>
      <Grid item xs={2.5} sx={{height: '100%'}}>
        <Chatbox roomName={roomName}/>
      </Grid>
    </Grid>
  )
}

export default GameBoard