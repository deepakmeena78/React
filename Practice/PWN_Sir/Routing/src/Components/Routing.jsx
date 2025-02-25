import React from "react";
import { Routes, Route } from "react-router-dom";
import About from "./About";
import Help from "./Help";
import Contact from "./Contact";

const Routing = () => {
  return (
    <Routes>
      <Route path="/about" element={<About />} />
      <Route path="/help" element={<Help />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="*" element={<h2>Page Not Found</h2>} />{" "}
    </Routes>
  );
};

export default Routing;
