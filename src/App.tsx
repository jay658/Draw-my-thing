import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import Canvas from './Components/Canvas/Canvas';
import Home from './Routes/Home'
import JoinScreen from './Components/JoinScreen/JoinScreen';
import LoadingScreen from './Components/LoadingScreen/LoadingScreen';
import NavBar from './Components/NavBar/NavBar'
import { ReactElement } from 'react'
import RoomList from './Components/RoomList/RoomList';
import WaitingRoom from './Components/WaitingRoom/WaitingRoom';

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
        <Route path="/loading" element={<LoadingScreen/>}/>
        <Route path="*" element={<Navigate to='/' replace={true}/>} />
      </Routes>
    </BrowserRouter>
  </>
  )
}

export default App