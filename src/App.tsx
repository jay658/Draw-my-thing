import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ReactElement, Suspense } from 'react'

import Home from './Routes/Home'
import { lazyLoad } from './Utility/lazyLoad'

const AboutPage = lazyLoad('../Routes/About')

const About = () => {
  return (
    <Suspense fallback={<h2>Loading...</h2>}>
      <AboutPage/>
    </Suspense>
  )
}

const App = ():ReactElement => {
  return(
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
          <Route path='/about' element={<About/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App