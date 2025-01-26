import React, { useContext } from "react";
import { ThemeContext } from "../App";

const ChildC = () => {
  
  const { theme, setTheme } = useContext(ThemeContext);
  function handelClick() {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }

  return (
    <div>
      <button onClick={handelClick}>Theme Change</button>
    </div>
  );
};

export default ChildC;
