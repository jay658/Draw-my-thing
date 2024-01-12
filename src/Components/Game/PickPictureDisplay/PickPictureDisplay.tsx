import { Dispatch, ReactElement, Ref, SetStateAction, forwardRef, useEffect, useState } from 'react';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import { Phase } from '../Types';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import socket from '../../Websocket/socket';

type PickPictureDisplayProps = {
  pictureUrls: {
    sessionId: string,
    pictureUrl: string
  }[],
  setPhase: Dispatch<SetStateAction<Phase>>
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement<any, any>;
  },
  ref: Ref<unknown>,
) {
  return <Slide direction="down" ref={ref} {...props} timeout={500}/>;
});

const PickPictureDisplay = ({ pictureUrls, setPhase } : PickPictureDisplayProps) => {

  const [open, setOpen] = useState(true);

  useEffect(() => {
    socket.on("starting_next_round", ()=>{
      setOpen(false)
      setPhase("Pick_Word")
    })

    return () => {
      socket.off('starting_next_round')
    }
  }, [])

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      aria-describedby="alert-dialog-slide-description"
      sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}
    >
      <DialogTitle fontSize={36} sx={{textAlign:'center'}}>{"Pick the best picture!"}</DialogTitle>
      <Grid container spacing={3} alignItems={'center'} width={'100%'} margin={'0px'} padding={'10px'}>
        {pictureUrls.map((image, idx) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
            <img src={image.pictureUrl} alt={`Picture ${idx + 1}`} style={{ maxWidth:'100%', maxHeight:'100%'}}/>
          </Grid>
        ))}
      </Grid>
    </Dialog>
  )
}

export default PickPictureDisplay