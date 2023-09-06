import { ChangeEvent, ReactElement, useEffect, useRef, useState } from "react";

import AvatarSelect from './AvatarSelect';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import JoinScreenErrors from "./ErrorMessage";
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import socket from "../Websocket/socket";
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom'

export type ErrorStateT = {
  roomNotFound: string,
  roomNameTaken: string
}

type JoinScreenPropsT = {
  setUsername: (username: string) => void,
  username: string
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

const StyledGrid = styled(Grid)(() => ({
  justifyContent:'center',
  alignItems:'center'
}))

const JoinScreen = ({setUsername}: JoinScreenPropsT): ReactElement => {
  const [name, setName] = useState('')
  const [roomName, setRoomName] = useState('')
  const [error, setError] = useState<ErrorStateT>({
    roomNotFound: '',
    roomNameTaken: ''
  })
  const errorRef = useRef(error)
  const [openError, setOpenError] = useState(errorRef.current.roomNotFound? true: false)
  const navigate = useNavigate()

  useEffect(() => {
    socket.on("room_not_found", (data) => {
      setOpenError(true)
      setError(prevError => {
        const newError = { ...prevError, roomNotFound: data }
        errorRef.current = newError
        return newError
      });
    });

    socket.on("room_name_taken", (data) => {
      setOpenError(true)
      setError(_prevError => {
        const newError = { roomNotFound: '', roomNameTaken: data }
        errorRef.current = newError
        return newError
      })
    })

    socket.on("create_room_success", (roomName) => {
      console.log(`${name} created room ${roomName}`)
      navigate(`/waitingroom?room=${roomName}`)
    })

    socket.on("join_room_success", (roomName) => {
      console.log(`${name} joined room ${roomName}`)
      navigate(`/waitingroom?room=${roomName}`)
    })

    // Cleanup by removing the event listener when the component unmounts
    return () => {
        socket.off("room_not_found")
        socket.off("room_name_taken")
        socket.off("create_room_success")
        socket.off("join_room_success")
    };
}, []);
  
  const handleCreateRoom = () => {
    if(!socket.connected) socket.connect()
    socket.emit('update_username', name)
    socket.emit("create_room", roomName)
    socket.username = name
  }

  const handleJoinRoom = () => {
    if(!socket.connected) socket.connect()
    socket.emit('update_username', name)
    socket.emit("join_room", roomName)
    socket.username = name
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
    socket.username = name
    setUsername(name)
    navigate('/rooms')
  }
  
  return(
    <StyledGrid container spacing={2}>
      <Item>
        <h1>APP'S NAME</h1>
        <InLineContainer>
          <TextField
            required
            label="Username"
            defaultValue=""
            onChange={handleNameChange}
            inputProps={{ maxLength: 15 }}
          />
          <AvatarSelect/>
        </InLineContainer>
        <TextField
          required
          label="Room name"
          defaultValue={name}
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
      <JoinScreenErrors error={errorRef.current} openError={openError} setOpenError={setOpenError}/>
    </StyledGrid>
  )
}

export default JoinScreen