import { useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '@mui/base';
import Canvas from './Canvas/Canvas';
import Chatbox from '../Chat/Chatbox';
import CircularProgress from '@mui/material/CircularProgress';
import EndOfRoundScoreboard from './ScoreBoard/EndOfRoundScoreboard';
import Grid from '@mui/material/Grid';
import PageNotFound from '../PageNotFound/PageNotFound';
import PickWord from './PickWord/PickWord';
import type { Player } from '../WaitingRoom/Types';
import ScoreBoard from './ScoreBoard/ScoreBoard';
import { Typography } from '@mui/material';
import WordDisplay from './WordDisplay/WordDisplay';
import socket from '../Websocket/socket';
import { useNavigate } from'react-router-dom';

const GameBoard = () => {
  const params = new URLSearchParams(window.location.search)
  const roomName = params.get("room")
  const navigate = useNavigate()
  const sessionId = sessionStorage.getItem('sessionId')
  const [players, setPlayers] = useState<Player[]>([])
  const [drawerIdx, setDrawerIdx] = useState(0)
  const [roomExists, setRoomExists] = useState(false)
  const [phase, setPhase] = useState("")
  const [loading, setLoading] = useState(true)
  const [round, setRound] = useState(1)
  const [wordChoices, setWordChoices] = useState<string[]>([])
  const [currentWord, setCurrentWord] = useState("")
  const drawer = useMemo(() => players.length ? players[drawerIdx] : null,[players, drawerIdx]) 
  const secondsElapsed = useRef(0)
  
  useEffect(() => {
    const finalizeLoading = (exists: boolean) => {
      setRoomExists(exists);
      setLoading(false);
    };
    
    if(!socket.connected && sessionId){
      socket.connect()
      socket.emit('restore_game_session', { sessionId, roomName }, (response: 'success' | 'failed', userInfo: { username: string, avatar: string, roomName: string}) => {
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
          socket.emit("get_game_info", roomName)
        }
      })
    }
    else if(!socket.connected && !sessionId){
      navigate('/join')
    }else {
      socket.emit("get_game_info", roomName)
    }
    
    socket.on("send_game_info_to_client", ({ players, elapsedSeconds, currentWord, drawerIdx, round, currentPhase })=>{
      if(!roomExists) setRoomExists(true)
      setPlayers(players)
      setCurrentWord(currentWord)
      setDrawerIdx(drawerIdx)
      setRound(round)
      setPhase(currentPhase)
      secondsElapsed.current = elapsedSeconds
      finalizeLoading(true)
    })

    socket.on('word_choices_from_server', (words, phase)=>{
      setWordChoices(words)
      setPhase(phase)
    })
    
    socket.on('set_currentWord_on_client', ({word, phase})=>{
      setCurrentWord(word)
      setPhase(phase)
    })

    socket.on('update_scores', (players) => {
      setPlayers(players)
    })
    socket.on('end_of_round_to_client', () => {
      setPhase("End_Of_Round")
    })

    return () => {
      socket.off("send_game_info_to_client")
      socket.off('word_choices_from_server')
      socket.off('set_currentWord_on_client')
      socket.off('update_scores')
      socket.off('end_of_round_to_client')
    }
  }, [])

  useEffect(()=>{
    socket.on('update_drawer_and_round', ({ drawerIdx, round, players }: { drawerIdx: number, round: number, players: Player[] }) => {
      setCurrentWord("")
      setWordChoices([])
      setPlayers(players)
      setDrawerIdx(drawerIdx)
      setRound(round)
    })

    return () => {
      socket.off('update_drawer_and_round')
    }
  },[players])

  useEffect(()=>{
    if(sessionId === drawer?.sessionId && wordChoices.length === 0){
      socket.emit("get_word_choices", roomName)
    }
  },[drawerIdx, players])

  const handleNextDrawer = () => {
    socket.emit('next_drawer', roomName)
  }
  
  if(loading) return <CircularProgress/>
  if(!roomExists) return <PageNotFound/>

  return (
    <Grid container sx={{height:'85vh'}}>
      {phase === "End_Of_Round" && 
        <EndOfRoundScoreboard setPhase={setPhase} players={players}/>
      }
      {!currentWord && sessionId === drawer?.sessionId && 
        <PickWord 
        words= {wordChoices} 
        roomName= {roomName}/>
      }
      <Grid item xs={2} sx={{height: '100%'}}>
        <ScoreBoard players={players} drawer={drawer}/>
      </Grid>
      <Grid item xs={7.5} sx={{height: '100%'}}>
        <WordDisplay word={currentWord} drawer={drawer} secondsElapsed={secondsElapsed.current}/>
        <Canvas drawerSessionId={players[drawerIdx].sessionId} roomName={roomName} drawerIdx={drawerIdx}/>
        <Typography>Round: {round}</Typography>
        <Button onClick={handleNextDrawer}>Next drawer</Button>
      </Grid>
      <Grid item xs={2.5} sx={{height: '100%'}}>
        <Chatbox roomName={roomName} currentWord={currentWord} drawer={drawer}/>
      </Grid>
    </Grid>
  )
}

export default GameBoard