import { useState } from 'react';
import './App.css';
import ComOne from './components/ComOne';

function App() {
  let [count, setCount] = useState(10);

  return <>
    <ComOne count={count} setCount={setCount} />
  </>
}

export default App;
