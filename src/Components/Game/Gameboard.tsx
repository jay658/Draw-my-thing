import { useEffect, useMemo, useState } from 'react';

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
import PickWord from './PickWord/PickWord';
import socket from '../Websocket/socket';

const GameBoard = () => {
  const params = new URLSearchParams(window.location.search)
  const roomName = params.get("room")
  const sessionId = sessionStorage.getItem('sessionId')
  const [players, setPlayers] = useState<Player[]>([])
  const [drawerIdx, setDrawerIdx] = useState(0)
  const [roomExists, setRoomExists] = useState(false)
  const [loading, setLoading] = useState(true)
  const [round, setRound] = useState(1)
  const [wordChoices, setWordChoices] = useState<string[]>([])
  const [currentWord, setCurrentWord] = useState("")
  const currentPlayer = useMemo(()=>players.length ? players[drawerIdx] : null,[players, drawerIdx]) 

  useEffect(() => {
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
          socket.emit("get_game_info", roomName)
        }
      })
    }else {
      socket.emit("get_game_info", roomName)
    }
    
    socket.on("send_game_info_to_client", (gameinfo)=>{
      if(!roomExists) setRoomExists(true)
      setPlayers([...gameinfo.players])
      finalizeLoading(true)
    })

    socket.on('word_choices_from_server', (words)=>{
      setWordChoices(words)
    })
    socket.on('set_currentWord_on_client', (word)=>{
      setCurrentWord(word)
    })

    return () => {
      socket.off("send_game_info_to_client")
      socket.off('update_drawer_and_round')
      socket.off('word_choices_from_server')
      socket.off('set_currentWord_on_client')
    }
  }, [])

  useEffect(()=>{
    socket.on('update_drawer_and_round', (newDrawerIdx: number, newRound: number) => {
      setCurrentWord("")
      setWordChoices([])
      setDrawerIdx(newDrawerIdx)
      setRound(newRound)
    })

    return () => {
      socket.off('update_drawer_and_round')
    }
  },[players])

  useEffect(()=>{
    console.log(currentPlayer, drawerIdx, players)

    if(sessionId === currentPlayer?.sessionId && wordChoices.length === 0){
      socket.emit("get_word_choices", roomName)
    }
  },[drawerIdx, players])

  const handleNextDrawer = () => {
    socket.emit('next_drawer', roomName)
  }
  if(loading) return <CircularProgress/>
  if(!roomExists) return <PageNotFound/>

  if(!currentWord && sessionId === currentPlayer?.sessionId){
    return <PickWord 
      words= {wordChoices} 
      setCurrentWord= {setCurrentWord}
      roomName= {roomName}
    />
  } 

  return (
    <Grid container sx={{height:'85vh'}}>
      <Grid item xs={2} sx={{height: '100%'}}>
        <ScoreBoard players={players} drawer={players[drawerIdx]}/>
      </Grid>
      <Grid item xs={7.5} sx={{height: '100%'}}>
        <WordDisplay word={currentWord}/>
        <Canvas drawerSessionId={players[drawerIdx].sessionId} roomName={roomName} drawerIdx={drawerIdx}/>
        <Typography>Round: {round}</Typography>
        <Button onClick={handleNextDrawer}>Next drawer</Button>
      </Grid>
      <Grid item xs={2.5} sx={{height: '100%'}}>
        <Chatbox roomName={roomName}/>
      </Grid>
    </Grid>
  )
}

export default GameBoard