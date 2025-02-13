import React from "react";

function Navbar() {
  return (
    <>
      {/* Top Bar */}
      <div className="top-bar d-flex justify-content-between align-items-center px-4 py-2">
        <div className="d-flex align-items-center">
          {/* Main Logo */}
          <img
            src="/Images/LOGO_2.png"
            alt="Logo"
            className="logo"
            style={{ height: "40px" }}
          />
          {/* Project Logo */}
          <img
            src="/Images/project_logo1.png"
            alt="Project Logo"
            className="ms-3"
            style={{ height: "40px" }}
          />
        </div>

        {/* Search Bar */}
        <div className="search-box d-flex align-items-center">
          <input
            className="form-control rounded-pill px-4"
            type="text"
            placeholder="Search..."
            style={{ width: "300px" }}
          />
          <i className="bi bi-search ms-2"></i> {/* Bootstrap Search Icon */}
        </div>

        {/* Login Button */}
        <button className="btn btn-outline-success rounded-pill px-4">
          Login
        </button>
      </div>

      {/* Main Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container">
          {/* Navbar Toggler (for mobile) */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navbar Content */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link active" href="#">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  About us
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Category
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Products
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Contact us
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* CSS Styles */}
      <style>
        {`
          .top-bar {
            background-color: #eaf6e8; /* Light green background */
          }
          .navbar {
            background-color: #1a1d22; /* Dark background */
          }
          .navbar-nav {
            margin-left: 0; /* Align navbar text to left */
          }
          .navbar-nav .nav-link {
            font-weight: bold;
          }
          .search-box input {
            border: 1px solid #ccc;
          }
        `}
      </style>
    </>
  );
}

export default Navbar;
