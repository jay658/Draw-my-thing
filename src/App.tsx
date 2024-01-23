import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import Canvas from './Components/Game/Canvas/Canvas';
import GameBoard from './Components/Game/Gameboard';
import JoinScreen from './Components/JoinScreen/JoinScreen';
import LoadingScreen from './Components/LoadingScreen/LoadingScreen';
import NavBar from './Components/NavBar/NavBar'
import { ReactElement } from 'react'
import RoomList from './Components/RoomList/RoomList';
import Test from './Routes/Test'
import WaitingRoom from './Components/WaitingRoom/WaitingRoom';

const App = ():ReactElement => {
  
  return(
    <>
    <BrowserRouter>
      <NavBar/>
      <Routes>
        <Route path="/" element={<JoinScreen/>} />
        <Route path="/draw" element={<Canvas drawerSessionId='' roomName={null} drawerIdx={0} phase={"Pick_Word"}/>} />
        <Route path ="/test" element={<Test/>}/>
        <Route path ="/rooms" element={<RoomList/>}/>
        <Route path ="/waitingroom" element={<WaitingRoom/>}/>
        <Route path="/loading" element={<LoadingScreen/>}/>
        <Route path="/game" element={<GameBoard/>}/>
        <Route path="*" element={<Navigate to='/' replace={true}/>} />
      </Routes>
    </BrowserRouter>
  </>
  )
}

export default App