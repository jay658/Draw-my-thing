import { useEffect, useState } from 'react';

import Grid from '@mui/material/Grid';
import type { Player } from '../../WaitingRoom/Types';
import Timer from './Timer';
import { Typography } from '@mui/material';
import socket from '../../Websocket/socket';

type OwnPropsT = {
  word: string,
  drawer: Player | null, 
  secondsElapsed: number,
}

const hideWord = (word: string, shownLetters?:Set<number>) => {
  let hiddenWord = ''
  
  word.split('').forEach((letter, i) => {
    if(letter === ' ' || shownLetters?.has(i)) hiddenWord += letter
    else hiddenWord += "_"
  })  
  
  return hiddenWord
}

const WordDisplay = ({ word, drawer, secondsElapsed }: OwnPropsT) => {
  const sessionId = sessionStorage.getItem('sessionId');
  const [currentWord, setCurrentWord] = useState('');
  const [shownLetters, setShownLetters] = useState<Set<number>>(new Set());

  useEffect(() => {
    socket.on('show_more_letters', (letters) => {
      setShownLetters(new Set([...letters]))
    })

    return () => {
      socket.off('show_more_letters')
    }
  }, [])
  
  useEffect(() => {
    setShownLetters(new Set())
  },[word])

  useEffect(() => {
    setCurrentWord(hideWord(word, shownLetters));
  },[word, shownLetters])
  
  return(
    <Grid container spacing={3} alignItems={'center'} width={'100%'} margin={'0px'}>
      <Grid item xs={3}>
        <Timer secondsElapsed={secondsElapsed}/>
      </Grid>
      <Grid item xs={6}>
        {sessionId === drawer?.sessionId? 
          <Typography style={{fontSize:'36px'}}>
            {word}
          </Typography>:
          <Typography style={{fontSize:'36px', fontFamily:'Monaco'}}>
            {currentWord}
          </Typography>
        }
      </Grid>
      <Grid item xs={3}></Grid>
    </Grid>
  )
}

export default WordDisplay