import Grid from '@mui/material/Grid';
import Timer from './Timer';
import { Typography } from '@mui/material';

type OwnPropsT = {
  word: string
}

const WordDisplay = ({ word }: OwnPropsT) => {
  return(
    <Grid container spacing={3} alignItems={'center'} width={'100%'} margin={'0px'}>
      <Grid item xs={3}>
        <Timer startTime={60}/>
      </Grid>
      <Grid item xs={6}>
        <Typography style={{fontSize:'36px'}}>
          {word}
        </Typography>
      </Grid>
      <Grid item xs={3}></Grid>
    </Grid>
  )
}

export default WordDisplay