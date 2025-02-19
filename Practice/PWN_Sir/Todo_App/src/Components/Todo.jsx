import React, { useRef, useState } from "react";
import Data from "./Data";

const Todo = () => {
  const [List, setList] = useState(Data);
  const [status, setStatus] = useState("Active");

  const addTask = () => {
    let title = RefTitle.current.value;
    let priority = Refpriority.current.value;
    let date = new Date();
    date =
      date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
    let greatestId = Math.max(...List.map((item) => item.id));
    setList([...List, { id: ++greatestId, title, Date: date, priority }]);
  };

  const active = (index) => {
    let data = List[index];
    data.status = "Deactive";
    List[index] = data;
  };

  const RefTitle = useRef();
  const Refpriority = useRef();

  return (
    <>
      <div
        className="container mt-3"
        style={{ width: "1000px", backgroundColor: "#d3ffc8", padding: "30px" }}
      >
        <div className="row">
          <div className="col-md-6">
            <input
              ref={RefTitle}
              id="roll"
              type="text"
              className="form-control"
              placeholder="Enter Title"
              style={{ background: "transparent" }}
            />
          </div>
          <div className="col-md-6">
            <select
              ref={Refpriority}
              className="form-control"
              name="priority"
              style={{ backgroundColor: "transparent" }}
            >
              <option value="0">Select priority</option>
              <option value="High">High</option>
              <option value="Mid">Mid</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
        <div className="row m-2">
          <div className="col-md-6">
            <button className="btn btn-success m-3" onClick={addTask}>
              Add
            </button>
          </div>
          <div className="col-md-6">
            <button
              className="btn btn-success m-3"
              onClick={() => setStatus("Active")}
            >
              Active
            </button>
            <button
              className="btn btn-success m-3"
              onClick={() => setStatus("Deactive")}
            >
              DeActive
            </button>
          </div>
        </div>
        <div className="container mt-3">
          <table className="table">
            <thead>
              <tr>
                <th>Sno.</th>
                <th>Title</th>
                <th>Date</th>
                <th>Priority</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {List.filter((item) => item.status === status).map(
                (data, index) => (
                  <tr key={index}>
                    <td>{data.id}</td>
                    <td>{data.title}</td>
                    <td>{data.Date}</td>
                    <td>{data.status}</td>
                    <td>{data.priority}</td>
                    <td>
                      <button
                        onClick={() => active(index)}
                        className="btn btn-outline-success"
                      >
                        Active
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Todo;
