import socket from './socket';
import { useState } from 'react';

export function ConnectionManager() {
  const [UserName, setUserName] = useState("");
  
  function changeUserName(event: React.ChangeEvent<HTMLInputElement>){
    setUserName(event.target.value)
  }
  
  function connect() {
    // send UserName to backend and add to socket
    socket.connect();
  }

  function disconnect() {
    socket.disconnect();
  }

  return (
    <>
      <input value={UserName} onChange={changeUserName}/>
      <button onClick={ connect }>Connect</button>
      <button onClick={ disconnect }>Disconnect</button>
    </>
  );
}