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
  roomName: string | null,
  setEndOfRound: Dispatch<SetStateAction<boolean>>
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement<any, any>;
  },
  ref: Ref<unknown>,
) {
  return <Slide direction="down" ref={ref} {...props} timeout={500}/>;
});

export default function EndOfRoundScoreboard({ roomName, setEndOfRound }: OwnPropsT) {
  const [open, setOpen] = useState(true);
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    socket.emit("get_roundend_scoreboard", roomName)
    socket.on("send_scoreboard_to_client", (players)=>{
      setPlayers(players)
    })
    socket.on("starting_next_round", ()=>{
      socket.emit('next_drawer', roomName)
      setOpen(false)
      setEndOfRound(false)
    })

    return () => {
      socket.off('send_scoreboard_to_client')
      socket.off('starting_next_round')
    }
  },[])

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