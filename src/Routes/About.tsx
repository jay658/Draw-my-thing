import { ReactElement } from "react";
import { useNavigate } from 'react-router-dom'

const About = (): ReactElement => {
  const navigate = useNavigate()
  
  return (
    <div>
      <p>This is the about page.</p>
      <button onClick={()=> navigate('/')}>Navigate to the home page</button>
    </div>
  )
}

export default About