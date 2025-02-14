import { Component } from "react";

export default class Header extends Component {
  render() {
    return (
      <>
        <div
          className="bg-danger d-flex justify-center align-items-center"
          style={{ height: "60px" }}
        >
          <label
            className="text-white"
            style={{ fontWeight: "bold", font: "20px" }}
          >
            Student App
          </label>
        </div>
      </>
    );
  }
}
