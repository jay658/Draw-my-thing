import './Test.css'

import { User, useGetUsersQuery, useGetUsersQueryResult } from '../Store/RTK/userSlice'
import { useGetAuthQuery, useGetAuthQueryResult, useLogoutMutation } from '../Store/RTK/authSlice'

import Button from '@mui/material/Button';
import TestComponent from '../Components/TestComponent'
import reactLogo from '../assets/react.svg'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import viteLogo from '/vite.svg'

function Test() {
  const [count, setCount] = useState(0)

  const { data: auth }: Partial<useGetAuthQueryResult> = useGetAuthQuery()
  const { data: users }: Partial<useGetUsersQueryResult> = useGetUsersQuery()
  const navigate = useNavigate()

  const [logoutMutation] = useLogoutMutation();

  const handleLogout = async () => {
    await logoutMutation();
  };

  return (
    <>
      <Button onClick={handleLogout}>Log out</Button>
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

export default Test
