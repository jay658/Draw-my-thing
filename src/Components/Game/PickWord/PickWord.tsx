import { Dispatch, SetStateAction } from 'react';
import { ReactElement, Ref, forwardRef, useState } from 'react';

import { Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import socket from '../../Websocket/socket';

type OwnPropsT = {
  words: string[]
  setCurrentWord: Dispatch<SetStateAction<string>>
  roomName: string | null
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement<any, any>;
  },
  ref: Ref<unknown>,
) {
  return <Slide direction="down" ref={ref} {...props} timeout={500}/>;
});

export default function PickWord({ words, setCurrentWord, roomName }: OwnPropsT) {
  const [open, setOpen] = useState(true);

  const handleClick = (word:string) =>{
    socket.emit('send_selected_word_to_other_players', {roomName, word})
    setOpen(false);
    setCurrentWord(word)
  }

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      aria-describedby="alert-dialog-slide-description"
      sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}
    >
      <DialogTitle fontSize={36} sx={{textAlign:'center'}}>{"Bring it to paper!"}</DialogTitle>
      <Grid container spacing={3} alignItems={'center'} width={'100%'} margin={'0px'} padding={'10px'}>
        {words.map((word, idx) =>(
          <Button key={idx} onClick={()=>handleClick(word)} style={{fontSize:'24px', width:'33%'}}>
            {word}
          </Button>
        ))}
      </Grid>
    </Dialog>
  );
}