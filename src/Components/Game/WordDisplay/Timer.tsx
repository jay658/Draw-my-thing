import { useEffect, useRef, useState } from "react"

import { Button } from '@mui/base';

type OwnPropsT = {
  startTime: number
}

const Timer = ({ startTime }: OwnPropsT) => {
  const [time, setTime] = useState(startTime)
  const timeRef = useRef(time)
  const timerRef = useRef<any>(null)

  useEffect(() => {
      timeRef.current = time
  }, [time]);

  const startTimer = () => {
    if(timerRef.current) clearInterval(timerRef.current)
    
    timerRef.current = setInterval(() => {
      if(timeRef.current === 0) clearInterval(timerRef.current)
      else setTime((prevTime) => prevTime - 1)
    }, 1000)
  }

  //@ts-ignore
  const updateTimer = (newTime: number) => {
      setTime(newTime)
      startTimer()
  }

  const resetTimer = () => {
    if(timerRef.current) clearInterval(timerRef.current)
    setTime(startTime)
    
    timerRef.current = setInterval(() => {
      if(timeRef.current === 0) clearInterval(timerRef.current)
      else setTime((prevTime) => prevTime - 1)
    }, 1000)
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