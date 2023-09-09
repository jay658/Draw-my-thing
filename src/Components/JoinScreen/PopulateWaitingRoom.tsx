import Lottie, { LottieRefCurrentProps } from 'lottie-react'
import { ReactElement, useRef } from "react";

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { MAX_ROOM_CAPACITY } from "./RoomList";
import type { Player } from './WaitingRoom'
import ReadyAnimation from '../../assets/lottie/ready-animation.json'
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { avatarsMap } from './AvatarSelect'
import socket from "../Websocket/socket";
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(() => ({
  borderRadius:'3%',
  width: '18vw',
  height: '100%',
  display:'flex',
  flexDirection: 'column',
  alignItems:' center',
  padding: '16px'
}))

const StyledSkeleton = styled(Skeleton)(() => ({
  borderRadius:'3%',
  width: '18vw',
  height: '100%',
  display:'flex',
  flexDirection: 'column',
  alignItems:' center',
  padding: '16px'
}))

type OwnPropsT = {
  players: Player[],
  readyUp: (idx: number) => void
}

const PopulateWaitingScreen = ({ players, readyUp }: OwnPropsT): ReactElement => {

  const readyAnimation = useRef<LottieRefCurrentProps>(null)

  const playerDetails = []
  for(let i = 0; i < MAX_ROOM_CAPACITY; i++){
    const player = players[i]
    playerDetails.push(
      i >= players.length? (<StyledSkeleton variant="rectangular" key={i}>
      </StyledSkeleton>):
      (<StyledCard key={i}>
          <Avatar alt={player.avatar} src={avatarsMap[player.avatar]}/>
          <CardContent>
            <Typography>
              Player {i + 1}
            </Typography>
            <Typography>
              Name: {player.username}
            </Typography>
            <Typography>
              Ready Status: {player.readyStatus ? "Ready" : "Not Ready"}
            </Typography>
          </CardContent>
          <CardActions>
            {socket.id === player.id && <Button size="small" onClick={()=> readyUp(i)}>Ready Up</Button>}
            <Lottie lottieRef={readyAnimation} loop={player.readyStatus? false: true} animationData={ReadyAnimation} initialSegment={player.readyStatus? [30, 100]: [0, 30]}/>
          </CardActions>
        </StyledCard>)
    )
  }

  return(
    <>
      {playerDetails.map(item => item)}
    </>
  )
}

export default PopulateWaitingScreen