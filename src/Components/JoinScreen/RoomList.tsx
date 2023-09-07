import { ReactElement, useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

import Button from '@mui/material/Button';
import socket from "../Websocket/socket";
import { useNavigate } from 'react-router-dom'

type Room = {
  name: string,
  members: string[]
}
export const MAX_ROOM_CAPACITY = 8

const RoomList = (): ReactElement => {
  const navigate = useNavigate()
  const [rooms, setRooms] = useState<Array<Room>>([])
  
  useEffect(()=>{
    if(!socket.username) navigate('/join')
    socket.on('send_rooms', (data: Array<Room>)=>{
      setRooms(data)
    })
    
    getRooms()

    return () => {
      socket.off('send_rooms')
    }
  },[])
  
  function getRooms(){
    socket.emit('get_rooms')
  }
  
  // if(!rooms.length) return <div>Loading</div>
  
  function joinRoom(roomName: string){
    console.log("joining room", roomName)
    socket.emit('join_room', roomName)
  }
  
  return (
    <div>
      <Button onClick={ getRooms }>REFRESH ROOMS</Button>
      <h3>{socket.username}</h3>
      <Table >
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Players</TableCell>
            <TableCell align="right">Join</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rooms.map((room, idx) => (
            <TableRow key={idx}>
              <TableCell component="th" scope="row">
                {room.name}
              </TableCell>
              <TableCell >{room.members.length}/{MAX_ROOM_CAPACITY}</TableCell>
              <TableCell align="right">
              <Button onClick = {()=>joinRoom(room.name)}>JOIN</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default RoomList;

