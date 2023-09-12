import { ChangeEvent, ReactElement, useEffect, useRef, useState } from "react";

import AvatarSelect from './AvatarSelect';
import Button from '@mui/material/Button';
import ErrorMessages from "./ErrorMessage";
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import socket from "../Websocket/socket";
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom'

export type JoinScreenErrorsT = {
  roomNotFound: string,
  roomNameTaken: string, 
  roomFull: string
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(3),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  width: '100vw',
  maxWidth: '600px',
  border: '1px solid black',
}));

const InLineContainer = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}));

const InnerGrid = styled(Grid)(() => ({
  justifyContent:'center',
  alignItems:'center'
}))

const OutterGrid = styled(Grid)(() => ({
  display: 'flex', 
  justifyContent: 'center', 
  alignItems: 'center', 
  height: '80vh'
}))

const JoinScreen = (): ReactElement => {
  const [name, setName] = useState('')
  const [roomName, setRoomName] = useState('')
  const [playerAvatar, setPlayerAvatar] = useState('Lounging Fox')
  const [error, setError] = useState<JoinScreenErrorsT>({
    roomNotFound: '',
    roomNameTaken: '',
    roomFull: ''
  })
  const errorRef = useRef(error)
  const [openError, setOpenError] = useState(errorRef.current.roomNotFound? true: false)
  const navigate = useNavigate()

  useEffect(() => {
    socket.on("room_name_taken", (data) => {
      setOpenError(true)
      setError(_prevError => {
        const newError = { roomNotFound: '', roomFull:'', roomNameTaken: data }
        errorRef.current = newError
        return newError
      })
    })

    // Cleanup by removing the event listener when the component unmounts
    return () => {
        socket.off("room_name_taken")
    };
}, []);
  
  const handleCreateRoom = () => {
    if(!socket.connected) socket.connect()
    socket.emit("create_room", {name, roomName, avatar: playerAvatar}, (response: 'success' | 'failed', sessionId: string) => {
      if(response === 'success') {
        socket.username = name
        sessionStorage.setItem('sessionId', sessionId)
        navigate(`/loading?redirect=/waitingroom?room=${roomName}`) 
      }
    })
  }

  const handleJoinRoom = () => {
    if(!socket.connected) socket.connect()
    socket.emit("join_room", {name, roomName, avatar: playerAvatar}, (response: string, userInfo: {name: string, roomName: string, sessionId: string}) => {
      if(response === 'join_room_success'){
        console.log(`${name} joined room ${roomName}`)
        socket.username = name
        sessionStorage.setItem('sessionId', userInfo.sessionId)
        navigate(`/loading?redirect=/waitingroom?room=${roomName}`)
      }else if(response === `There is no room ${roomName}`){
        setOpenError(true)
        setError(_prevError => {
          const newError = { roomNameTaken: '', roomFull: '', roomNotFound: response }
          errorRef.current = newError
          return newError
        });
      }else if(response === `Room ${roomName} is currently full!`){
        setOpenError(true)
        setError(_prevError => {
          const newError = { roomNameTaken: '', roomNotFound: '', roomFull: response }
          errorRef.current = newError
          return newError
        });
      }
    })
  }

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const handleRoomChange = (e: ChangeEvent<HTMLInputElement>) => {
    const updatedError = {...error, roomNameTaken: '', roomNotFound: ''}
    setError(updatedError)
    errorRef.current = updatedError
    setRoomName(e.target.value)
  }

  const handleGoToRoomList = () => {
    if(!socket.connected) socket.connect()
    navigate('/rooms')
  }
  
  return(
    <OutterGrid>
      <InnerGrid container spacing={2}>
        <Item>
          <h1>DRAW MY THING</h1>
          <InLineContainer>
            <TextField
              required
              label="Username"
              defaultValue={name}
              onChange={handleNameChange}
              inputProps={{ maxLength: 15 }}
            />
            <AvatarSelect setPlayerAvatar={setPlayerAvatar}/>
          </InLineContainer>
          <TextField
            required
            label="Room name"
            defaultValue={roomName}
            onChange={handleRoomChange}
            inputProps={{ maxLength: 15 }}
          />
          <InLineContainer>
            <Button onClick={handleCreateRoom} disabled={!roomName || !name}>CREATE ROOM</Button>
            <Button onClick={handleJoinRoom} disabled={!roomName || !name}>JOIN ROOM</Button>
          </InLineContainer>
          <InLineContainer>
            <Button onClick={handleGoToRoomList} disabled={!name}>
              Join an existing room (Pick a username first!)
            </Button>
          </InLineContainer>
        </Item>
        <ErrorMessages error={errorRef.current} openError={openError} setOpenError={setOpenError}/>
      </InnerGrid>
    </OutterGrid>
  )
}

export default JoinScreen