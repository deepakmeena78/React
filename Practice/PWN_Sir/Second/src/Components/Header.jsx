import { Component } from "react";

class Header extends Component {
  render() {
    return (
      <>
        <div
          className="bg-danger d-flex ustify-content-center align-items-center"
          style={{ height: "60px" }}
        >
          <label
            className="text-white"
            style={{ fontWeight: "bold", fontSize: "20px" }}
          >
            Student app
          </label>
        </div>
      </>
    );
  }
}

export default Header;
