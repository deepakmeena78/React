import { useState } from 'react'
import './App.css'

function App() {
  const [color, setColor] = useState("white");

  return (
     <div className="w-full h-screen duration-200"
     style={{backgroundColor: color}}
     ><div className='fixed flex flex-wrap justify-center bottom-12 inset-x-0 px-2'>
      <div className='flex flex-wrap justify-center gap-3 shadow-lg bg-white px-3 py-2 rounded-3xl'>
        <button onClick={()=>setColor("red")} className='outline-mone px-4 py-1 rounded-full ' style={{backgroundColor: "red"}}>Red</button>
        <button onClick={()=>setColor("green")} className='outline-mone px-4 py-1 rounded-full ' style={{backgroundColor: "green"}}>Green</button>
        <button onClick={()=>setColor("black")} className='outline-mone px-4 py-1 rounded-full text-white' style={{backgroundColor: "black"}}>Black</button>
        <button onClick={()=>setColor("blue")} className='outline-mone px-4 py-1 rounded-full text-white' style={{backgroundColor: "blue"}}>Blue</button>
        <button onClick={()=>setColor("olive")} className='outline-mone px-4 py-1 rounded-full text-white' style={{backgroundColor: "olive"}}>Olive</button>
        <button onClick={()=>setColor("yellow")} className='outline-mone px-4 py-1 rounded-full ' style={{backgroundColor: "yellow"}}>Yellow</button>
        <button onClick={()=>setColor("white")} className='outline-mone px-4 py-1 rounded-full border-2 ' style={{backgroundColor: "white"}}>White</button>
      </div>
     </div>
      </div>
  )
}

export default App
