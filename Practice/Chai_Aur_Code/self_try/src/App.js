import { createContext, useState } from 'react';
import './App.css';
import ComC from './components/ComC';

export const OpenContext = createContext();
function App() {
  const [color, setColor] = useState("red");

  return (
    <OpenContext.Provider value={{ color, setColor }}>
      <div style={{ backgraound: color === "red" ? "red" : "blue" }}>
        <ComC />
      </div>
    </OpenContext.Provider>
  );
}

export default App;
