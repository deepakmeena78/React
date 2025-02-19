import "./App.css";
import ArrayTry from "./ArrayTry";

function App() {
  let data = {
    name: "Deepak",
    age: 20,
    batch: 10,
  };

  return (
    <>
      <ArrayTry />
      {Object.entries(data).map(([key, value], index) => (
        <p key={index}>
          {key}: {value}
        </p>
      ))}
    </>
  );
}

export default App;
