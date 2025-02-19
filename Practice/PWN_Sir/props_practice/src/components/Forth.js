import React from 'react'

const Forth = ({ count, setCount }) => {
    return <>
        <h1>Forth :  {count}</h1>
        <button onClick={() => setCount(count + 1)}>Click</button>
    </>
}

export default Forth
