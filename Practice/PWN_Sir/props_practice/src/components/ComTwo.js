import React from 'react'
import ComThree from './ComThree'

const ComTwo = ({ count, setCount }) => {
    return <>
        <h1>Two : {count}</h1>
        <ComThree count={count} setCount={setCount} />
    </>
}

export default ComTwo
