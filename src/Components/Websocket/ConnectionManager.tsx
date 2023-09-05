import { useEffect, useState } from 'react';

import JoinScreen from '../JoinScreen/JoinScreen';
import socket from './socket';

export function ConnectionManager() {
  const [usernameFormValue, setUsernameFormValue] = useState("");
  const [username, setUsername] = useState(socket.username);

  useEffect(() => {
    socket.on("sending_username", (data) => {
      socket.username = data
      setUsername(socket.username)
      setUsernameFormValue('')
    })

    return() => {
      socket.off("sending_username")
    }
  }, [])
  
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
    socket.emit('add_username', {username: usernameFormValue})
  }

  return (
    <>
      <h2>Current username: {username}</h2>
      <JoinScreen setUsername={setUsername} username={username}/>
      <input value={usernameFormValue} onChange={handleUsernameForm}/>
      <button onClick={ handleChangeUsername }>Change username</button>
      <button onClick={ connect }>Connect</button>
      <button onClick={ disconnect }>Disconnect</button>
    </>
  );
}