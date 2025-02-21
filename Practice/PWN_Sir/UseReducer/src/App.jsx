import { useReducer } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useReducer(
    (count, action) => {
      console.log(action);
      if (action.type == "plus") {
        count.value = count.value + 1;
      } else if (action.type == "minus") {
        count.value = count.value - 1;
      } else if (action.type == "ten") {
        count.value = count.value + action.paylod;
      }
      return { ...count };
    },
    { value: 10 }
  );

  return (
    <>
      <h1>{count.value}</h1>
      <button style={{ margin: "10px" }} onClick={() => setCount({ type: "plus" })}>Plus</button>
      <button style={{ margin: "10px" }} onClick={() => setCount({ type: "minus" })}>Minus</button>
      <button style={{ margin: "10px" }} onClick={() => setCount({ type: "ten", paylod: 10 })}>
        10-Plus
      </button>
    </>
  );
}

export default App;
