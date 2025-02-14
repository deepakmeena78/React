import { Component } from "react";

export default class Tamp extends Component {
  constructor() {
    super();
    this.state = {
      studentList: Data,
      branchList: ["CS", "IT", "CV", "Mech"],
      buttonDecoration: {
        width: "100px",
      },
      defaultBranch: "All",
    };
  }

  addStudent = () => {
    let roll = this.roll.value;
  };

  render() {
    return (
      <>
        <div className="container mt-3">
          <div className="row">
            <div className="col-md-6">
              <input
                ref={(obj) => (this.roll = obj)}
                id="roll"
                type="text"
                className="from-control"
                placeholder="Enter Roll Number"
              />
            </div>
            <div className="col-md-6">
              <input
                ref={(obj) => (this.name = obj)}
                id="name"
                type="text"
                className="from-control"
                placeholder="Enter Student Name"
              />
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-md-6">
              <select
                ref={(onj) => (this.gender = obj)}
                id="gender"
                className="from-control"
              >
                <option value="0">Select Gender</option>
                <option value="female">female</option>
                <option value="male">male</option>
              </select>
            </div>
            <div className="col-md-6">
              <select
                ref={(obj) => (this.branch = obj)}
                id="branch"
                className="from-control"
              >
                <option value="0">Select Branch</option>
                {this.state.branchList.map((branch, index) => {
                  return (
                    <option value={branch} key={index}>
                      {branch}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-md-6">
              <button onClick={() => this.setState}></button>
            </div>
            <div className="col-md-6">
              <button
                onClick={() => this.setState({ defaultBranch: "CS" })}
                className="btn btn-primany"
                style={this.state.buttonDecoration}
              >
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
}
