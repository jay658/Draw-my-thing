import './Home.css'

import { User, useGetUsersQuery, useGetUsersQueryResult } from '../Store/RTK/userSlice'
import { useGetAuthQuery, useGetAuthQueryResult } from '../Store/RTK/authSlice'

import TestComponent from '../Components/TestComponent'
import reactLogo from '../assets/react.svg'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import viteLogo from '/vite.svg'

function Home() {
  const [count, setCount] = useState(0)

  const { data: auth }: Partial<useGetAuthQueryResult> = useGetAuthQuery()
  const { data: users }: Partial<useGetUsersQueryResult> = useGetUsersQuery()
  const navigate = useNavigate()

  return (
    <>
      <div>
        Logged in as: {auth && auth.username}
      </div>
      <ul>
        Users in the db:
        {users && users.map((user: User) => {
          return (
            <li key={user.id}>
              {`${user.id}: ${user.username}`}
            </li>
          )})}
      </ul>
      {/* google login button */}
      <div>
        <button className="google" onClick={() => (window.location.href ="/api/googleOauth")}>
            <img src="/images/google-icon.svg"/>
            Google Login
        </button>
      </div>
      {/* github login button */}
      <div>
        <button className="github" onClick={() => {
          window.location.href ="/api/githubOauth"
          console.log('does this run?')
        }}>
            <img src=""/>
            Github Login
        </button>
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
      <TestComponent data={'test data'}/>
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
