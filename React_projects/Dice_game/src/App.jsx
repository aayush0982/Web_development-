import { useState } from 'react'
import Home from './components/home'
import Gamepage from './components/Gamepage'
import './App.css'

function App() {

  const [Toggle, setToggle] = useState(false)

  const isToggled = ()=>{
    setToggle((prev)=> !prev);
  }
  return (
    <>
      {Toggle? <Gamepage /> : <Home toggle={isToggled}/>}
    </>
  )
}

export default App
