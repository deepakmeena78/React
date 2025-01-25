import { useContext } from "react";
import './App.css';
import Counter from "./components/Counterr";
import { CounterContext } from "./context/Counter";

function App() {
  const counterState = useContext(CounterContext);
  console.log("Good Yaar ",counterState);

  return (
    <div className="App">
      <h1>Count Is {counterState.count}</h1>
      <Counter />
      <Counter />
      <Counter />
      <Counter />
    </div>
  );
}

export default App;
