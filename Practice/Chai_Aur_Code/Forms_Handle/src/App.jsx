import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='container'>
      <form action="">
        <input type="text" name='username'/>
        <input type="password"  name='password'/>
        <input type="submit" value="Submit"/>
      </form>
      </div>
    </>
  )
}

export default App
