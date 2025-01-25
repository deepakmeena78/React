import React, { useState } from "react";

const EvenOdd = () => {
  const [count, Setcount] = useState(1);

  return (
    <div>
      <h1>Count Number - {count}</h1>
      <h1>Number is - {count % 2 === 0 ? "Even" : "Odd"}</h1>
      <button className="button-one" onClick={() => Setcount(count + 1)}>Plus</button>
      <button className="button-one" onClick={() => Setcount(count - 1)}>Minus</button>
    </div>
  );
};

export default EvenOdd;
