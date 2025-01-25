import React,{useContext} from "react";
import  {CounterContext } from "../context/Counter"

const Counterr = () => {
  const counterContext = useContext(CounterContext);
  return (  
    <div> 
     <button className="btn-1" onClick={()=> counterContext.setCount(counterContext.count + 1)}>Plus</button>
     <button className="btn-2"  onClick={()=> counterContext.setCount(counterContext.count - 1)}>Minus</button>
    </div>
  );
};

export default Counterr;
