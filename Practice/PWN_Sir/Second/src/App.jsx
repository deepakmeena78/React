import { Component } from "react";
import Header from "./Components/Header";

class App extends Component {
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
    let name = this.roll.value;
    let gender = this.roll.value;
    let branch = this.roll.value;
    this.setState({
      studentList: [...this.state.studentList, { roll, name, gender, branch }],
    });
  };

  remove = (rollNumber) => {
    if (window.confirm("Do you want to delete it ?")) {
      this.state.studentList.findIndex((student) => {
        return student.roll == rollNumber;
      });
    }
  };

  render() {
    return (
      <>
        <Header />
        <div></div>
      </>
    );
  }
}
