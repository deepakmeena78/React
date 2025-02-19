import React from "react";

const ArrayTry = () => {
  let arr = ["A", "B", "C", "D", "E"];

  return (
    <>
      {arr.map((data, index) => (
        <div key={index}>
          <h1>
            {index} : {data}
          </h1>
        </div>
      ))}
    </>
  );
};

export default ArrayTry;
