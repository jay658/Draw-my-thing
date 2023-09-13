import Grid from '@mui/material/Grid';
import Lottie from 'lottie-react'
import type { Player } from "../WaitingRoom/Types"
import { Typography } from '@mui/material';
import { avatarsMap } from "../JoinScreen/AvatarSelect"

type OwnPropsT = {
  players: Player[],
  drawer: Player | null
}

const ScoreBoard = ({ players, drawer }: OwnPropsT) => {
  return (
    <Grid style={{
      height: '100%',
      width: '100%',
      margin:'10px',
      marginTop:'5vh',
      marginLeft:'5px',
      borderRadius:'3%',
      padding: '5px',
      backgroundColor: '#EAEAEA'}}>
      {players.map(player => {
        const avatarData = avatarsMap[player.avatar]
        return(
          <Grid style={{display: 'flex', gap:'10px', alignItems:'center', height:'12.25%', width:'100%', border:player.sessionId === drawer?.sessionId? '1px solid red': ''}}>
            <Lottie animationData={avatarData} style={{flex:'0 0 20%'}}/>
            <Typography style={{fontSize:'14px', flex:'0 0 33%'}}>{player.username}</Typography>
            <Typography style={{fontSize:'14px', flex:'0 0 33%'}}>300</Typography>
          </Grid>
        )
      })}
    </Grid>
  )
}

export default ScoreBoard