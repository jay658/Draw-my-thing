import { StyledCard, StyledCardContent, StyledSkeleton } from './StyledComponents';

import Button from '@mui/material/Button';
import Lottie from 'lottie-react'
import { MAX_ROOM_CAPACITY } from "../RoomList/RoomList";
import type { Player } from './Types'
import { ReactElement } from "react";
import ReadyAnimation from '../../assets/lottie/ready-animation.json'
import Typography from '@mui/material/Typography';
import { avatarsMap } from '../JoinScreen/AvatarSelect'

type OwnPropsT = {
  players: Player[],
  readyUp: () => void
}

const PopulateWaitingScreen = ({ players, readyUp }: OwnPropsT): ReactElement => {
  const sessionId = sessionStorage.getItem('sessionId')
  const playerDetails = []
  for(let i = 0; i < MAX_ROOM_CAPACITY; i++){
    const player = players[i]
    playerDetails.push(
      i >= players.length? (<StyledSkeleton variant="rectangular" key={i}>
      </StyledSkeleton>):
      (<StyledCard key={i}>
          <Lottie animationData={avatarsMap[player.avatar]} style={{height:'30%'}}/>
          <StyledCardContent>
            <Typography>
              {player.username}
            </Typography>
            <Lottie loop={player.readyStatus? false: true} animationData={ReadyAnimation} initialSegment={player.readyStatus? [30, 100]: [0, 30]} style={{height:'50%'}}/>
            <Button size="small" onClick={()=> readyUp()} style={{visibility: sessionId === player.sessionId? 'visible': 'hidden'}}>Ready Up</Button>
          </StyledCardContent>
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