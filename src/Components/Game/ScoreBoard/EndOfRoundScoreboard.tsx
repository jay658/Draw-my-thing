import { Dispatch, ReactElement, Ref, SetStateAction, forwardRef, useEffect, useState } from 'react';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import type { Player } from '../../WaitingRoom/Types';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { Typography } from '@mui/material';
import socket from '../../Websocket/socket';

type OwnPropsT = {
  setPhase: Dispatch<SetStateAction<string>>
  players: Player[]
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement<any, any>;
  },
  ref: Ref<unknown>,
) {
  return <Slide direction="down" ref={ref} {...props} timeout={500}/>;
});

export default function EndOfRoundScoreboard({ setPhase, players }: OwnPropsT) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    socket.on("starting_next_round", ()=>{
      setOpen(false)
      setPhase("Pick_Word")
    })

    return () => {
      socket.off('starting_next_round')
    }
  }, [players])

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      aria-describedby="alert-dialog-slide-description"
      sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}
    >
      <DialogTitle fontSize={36} sx={{textAlign:'center'}}>{"End of Round Scores"}</DialogTitle>
      <Grid flexDirection={'column'} container spacing={3} alignItems={'center'} width={'100%'} margin={'0px'} padding={'10px'}>
        {players.map((player, idx) =>(
          <Typography key={idx} style={{width:`${100/players.length}%`}}>
            {player.username}: {player.score} + {player.pointsThisRound}
          </Typography>
        ))}
      </Grid>
    </Dialog>
  );
}