import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    console.log("Plus One");
  }, [count]);

  return (
    <>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>Click</button>
    </>
  );
}

export default App;
