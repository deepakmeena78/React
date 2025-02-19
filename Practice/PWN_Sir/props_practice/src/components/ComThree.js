import React from 'react'
import Forth from './Forth'

const ComThree = ({ count, setCount }) => {
    return <>
        <h1>Three : {count}</h1>
        <Forth count={count} setCount={setCount} />
    </>
}

export default ComThree
