import React from "react";
import Header from "./components/Header";
import TodoItem from "./components/TodoItem";
import Button from "./components/Button";
import "./Style.css";

function App() {
  return (
    <div className="todo-container">
      <Header title="Todoo" />
      <TodoItem text="Eat" />
      <TodoItem completed={true} text="Code" />
      <TodoItem text="Play" />
      <TodoItem text="Study" />
      <TodoItem text="Sleep" /> 
      <Button />
    </div>
  )
}

export default App;
