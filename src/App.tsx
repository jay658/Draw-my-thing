import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import Canvas from './Components/Canvas';
import Chatbox from './Components/JoinScreen/Chatbox';
import Home from './Routes/Home'
import JoinScreen from './Components/JoinScreen/JoinScreen';
import LoadingScreen from './Components/JoinScreen/LoadingScreen';
import NavBar from './Components/NavBar'
import { ReactElement } from 'react'
import RoomList from './Components/JoinScreen/RoomList';
import WaitingRoom from './Components/JoinScreen/WaitingRoom';

const App = ():ReactElement => {
  
  return(
    <>
    <BrowserRouter>
      <NavBar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/draw" element={<Canvas />} />
        <Route path ="/join" element={<JoinScreen/>}/>
        <Route path ="/rooms" element={<RoomList/>}/>
        <Route path ="/waitingroom" element={<WaitingRoom/>}/>
        <Route path ="/chatbox" element={<Chatbox/>}/>
        <Route path="/loading" element={<LoadingScreen/>}/>
        <Route path="*" element={<Navigate to='/' replace={true}/>} />
      </Routes>
    </BrowserRouter>
  </>
  )
}

export default App