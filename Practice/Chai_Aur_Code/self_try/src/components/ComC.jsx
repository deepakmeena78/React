import React, { createContext } from "react";
const {OpenContext} = "../App";

const ComC = () => {
  const { color, setColor } = createContext(OpenContext);
  function On() {
    if (color === "red") {
      setColor("blue");
    } else {
      setColor("red");
    }
  }

  return (
    <div>
      <button onClick={On}>Color Change</button>
    </div>
  );
};

export default ComC;
