import React from 'react'
import ComTwo from "../components/ComTwo"

const ComOne = ({ count, setCount }) => {
  return <>
    <h1>One : {count}</h1>
    <ComTwo count={count} setCount={setCount} />
  </>
}

export default ComOne
