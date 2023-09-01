import socket from './socket';
import { useState } from 'react';

export function ConnectionManager() {
  const [usernameFormValue, setUsernameFormValue] = useState("");
  const [username, setUsername] = useState(socket.username);
  
  function handleUsernameForm(event: React.ChangeEvent<HTMLInputElement>){
    setUsernameFormValue(event.target.value)
  }
  
  function connect() {
    socket.connect();
  }

  function disconnect() {
    socket.disconnect();
  }

  function handleChangeUsername() {
    socket.emit('add username', {username: usernameFormValue})
    socket.on("sending username", (data) => {
      socket.username = data
      setUsername(socket.username)
      setUsernameFormValue('')
    })
  }

  return (
    <>
      <h2>Current username: {username}</h2>
      <input value={usernameFormValue} onChange={handleUsernameForm}/>
      <button onClick={ handleChangeUsername }>Change username</button>
      <button onClick={ connect }>Connect</button>
      <button onClick={ disconnect }>Disconnect</button>
    </>
  );
}