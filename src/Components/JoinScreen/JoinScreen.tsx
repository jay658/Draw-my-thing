import AvatarSelect from './AvatarSelect';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { ReactElement } from "react";
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(3),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  width: '40vw',
  height: '40vh',
  border: '1px solid black',
  top: '50%',
  left: '50%',
  position: 'absolute',
  transform: 'translate(-50%, -50%)',
}));

const InLineContainer = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}));

const JoinScreen = (): ReactElement => {
  
  return(
    <Grid container spacing={2}>
      <Grid>
        <Item>
          <h1>APP'S NAME</h1>
          <InLineContainer>
            <TextField
              required
              label="Pick a name"
              defaultValue=""
            />
            <AvatarSelect/>
          </InLineContainer>
          <TextField
            label="Room name"
            defaultValue=""
          />
          <InLineContainer>
            <Button>CREATE ROOM</Button>
            <Button>JOIN ROOM</Button>
          </InLineContainer>
        </Item>
      </Grid>
    </Grid>
  )
}

export default JoinScreen