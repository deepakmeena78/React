import { useState, useRef } from "react";
import "./App.css";

function App() {
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);

  const secondRef = useRef(null);
  const minuteRef = useRef(null);
  const hourRef = useRef(null);

  const start = () => {
    if (secondRef.current || minuteRef.current || hourRef.current) return;

    secondRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev === 59) {
          setMinutes((m) => (m === 59 ? 0 : m + 1));
          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    minuteRef.current = setInterval(() => {
      setMinutes((prev) => {
        if (prev === 59) {
          setHours((h) => h + 1);
          return 0;
        }
        return prev + 1;
      });
    }, 60000);

    hourRef.current = setInterval(() => {
      setHours((prev) => prev + 1);
    }, 3600000);
  };

  const stop = () => {
    clearInterval(secondRef.current);
    clearInterval(minuteRef.current);
    clearInterval(hourRef.current);
    secondRef.current = null;
    minuteRef.current = null;
    hourRef.current = null;
  };

  const reset = () => {
    stop();
    setSeconds(0);
    setMinutes(0);
    setHours(0);
  };

  return (
    <>
      <h1>Seconds: {seconds}</h1>
      <h1>Minutes: {minutes}</h1>
      <h1>Hours: {hours}</h1>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
      <button onClick={reset}>Reset</button>
    </>
  );
}

export default App;
