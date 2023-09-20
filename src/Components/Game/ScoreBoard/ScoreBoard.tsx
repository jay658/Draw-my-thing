import Grid from '@mui/material/Grid';
import Lottie from 'lottie-react'
import type { Player } from "../../WaitingRoom/Types"
import { Typography } from '@mui/material';
import { avatarsMap } from "../../JoinScreen/AvatarSelect"

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
          <Grid container height={'12.25%'} width={'100%'} margin={'0px'} alignItems={'center'} justifyContent={'center'} border={player.pointsThisRound? '1px solid #32CD32': ''} style={{border:player.sessionId === drawer?.sessionId? '1px solid red': ''}} key={player.sessionId}>
            <Grid item xs={3} alignItems={'center'} justifyContent={'center'}>
              <Lottie animationData={avatarData}/>
            </Grid>
            <Grid item xs={4} alignItems={'center'} justifyContent={'center'}>
              <Typography style={{fontSize:'14px'}}>{player.username}</Typography>
            </Grid>
            <Grid item xs={4} alignItems={'center'} justifyContent={'center'}>
              <Typography style={{fontSize:'14px'}}>{player.score}</Typography>
            </Grid>
          </Grid>
        )
      })}
    </Grid>
  )
}

export default ScoreBoard