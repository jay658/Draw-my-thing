import './Home.css'

import { useEffect, useState } from 'react'

import TestComponent from '../Components/TestComponent'
import axios from "axios"
import reactLogo from '../assets/react.svg'
import { useNavigate } from 'react-router-dom'
import viteLogo from '/vite.svg'

function Home() {
  const [count, setCount] = useState(0)
  const [data, setData] = useState('');
  
  useEffect(() => {
    const getData = async () =>{
      try{
        const response = await axios.get('/api/users')
        setData(response.data)
        //return () => setData('')
      }catch(err){
        console.log(err)
      }
    }
    getData()
  }, [])

  const navigate = useNavigate()

  return (
    <>
      <div>
        Server Data: {data}
      </div>
      <button onClick={()=> navigate('/about')}>Navigate to the about page</button>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <TestComponent data={data}/>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default Home
