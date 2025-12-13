import React from "react";

const Navbar = ({ title, right }) => {
  return (
    <div className="topbar">
      <h1 className="pageTitle">{title}</h1>
      <div>{right}</div>
    </div>
  );
};

export default Navbar;
