import { useEffect, useRef, useState } from "react"

import { Button } from '@mui/base';
import socket from "../../Websocket/socket";

const START_TIME = 30

type OwnPropsT = {
  secondsElapsed: number
}

const Timer = ({ secondsElapsed = 0 }: OwnPropsT) => {
  const [time, setTime] = useState(START_TIME - secondsElapsed) 
  const timeRef = useRef(time)
  const timerRef = useRef<any>(null)

  useEffect(() => {
    socket.on('start_timer', () => {
      console.log('starting timer')
      resetTimer()
    })

    socket.on('update_timer', (time: number) => {
      console.log(`updating time: ${time}`)
      updateTimer(time)
    })

    return () => {
      socket.off('update_timer')
      socket.off('start_timer')
      if(timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  useEffect(() => {
      timeRef.current = time
  }, [time]);

  const startTimer = () => {
    if(timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      if(timeRef.current === 0) {
        clearInterval(timerRef.current)
      }
      else {
        console.log(timeRef.current - 1)
        setTime((prevTime) => prevTime - 1)
      }
    }, 1000)
  }

  const updateTimer = (updatedTime: number) => {
    setTime(updatedTime)
    startTimer()
  }

  const resetTimer = () => {
    setTime(START_TIME)
    startTimer()
  }
  
  return(
    <>
      {time}
      <Button onClick={startTimer}>Start Timer</Button>
      <Button onClick={resetTimer}>Reset Timer</Button>
    </>
  )
}

export default Timer