import Grid from '@mui/material/Grid';
import { Button } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import socket from '../../Websocket/socket';

type OwnPropsT = {
  words: string[]
  setCurrentWord: Dispatch<SetStateAction<string>>
  roomName: string | null
}

const PickWord = ({ words, setCurrentWord, roomName }: OwnPropsT) => {
  const handleClick = (word:string) =>{
    socket.emit('send_selected_word_to_other_players', {roomName, word})
    setCurrentWord(word)
  }
  return(
    <Grid container spacing={3} alignItems={'center'} width={'100%'} margin={'0px'}>
      {words.map((word, idx) =>(
        <Button key={idx} onClick={()=>handleClick(word)}>
          {word}
        </Button>
      ))}
    </Grid>
  )
}

export default PickWord