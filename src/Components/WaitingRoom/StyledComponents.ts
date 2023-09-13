import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Grid } from "@mui/material";
import Skeleton from '@mui/material/Skeleton';
import { styled } from '@mui/material/styles';

/* WAITING ROOM STYLED COMPONENTS */
const OutterGrid = styled(Grid)(() => ({
  paddingTop: '40px',
  margin: '0px',
  justifyContent: 'flex-start',
  flexDirection: 'column',
  height: '80vh',
}))

const InnerGrid = styled(Grid)(() => ({
  display: 'flex', 
  justifyContent: 'center', 
  alignItems: 'stretch',
  flexWrap: 'wrap', 
  height: '40%',
  gap: 'calc(100vw * 0.02)',
}))

const PlayersInfoContainer = styled('div')(() => ({
  display: 'flex', 
  flexDirection:'column', 
  height: '90vh', 
  alignItems:'center',
  flex: '0 0 70%'
}))

const WaitingRoomContainer = styled('div')(() => ({
  display:'flex'
}))

const ChatBoxContainer = styled('div')(() => ({
  flex:'0 0 30%',
  height: '60vh',
  width: '25vw'
}))

/*POPULATE WAITING ROOM STYLED COMPONENTS */

const StyledCard = styled(Card)(() => ({
  borderRadius:'3%',
  width: '12vw',
  height: '100%',
  display:'flex',
  flexDirection: 'column',
  alignItems:' center',
  padding: '16px',
  justifyContent: 'center'
}))

const StyledSkeleton = styled(Skeleton)(() => ({
  borderRadius:'3%',
  width: '12vw',
  height: '100%',
  display:'flex',
  flexDirection: 'column',
  alignItems:' center',
  padding: '16px'
}))

const StyledCardContent = styled(CardContent)(() => ({
  padding:'5px',
  height:'50%'
}))

export {
  /* WAITING ROOM COMPONENTS */
  OutterGrid,
  InnerGrid,
  PlayersInfoContainer,
  WaitingRoomContainer,
  ChatBoxContainer,
  
  /* POPULATE WAITING ROOM COMPONENTS */
  StyledCard,
  StyledSkeleton,
  StyledCardContent,
}