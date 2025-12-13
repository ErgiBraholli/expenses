import React from "react";
import { Link } from "react-router-dom";
import "../styles/app.css";

const NotFound = () => {
  return (
    <div className="centerPage">
      <div className="card" style={{ maxWidth: 520 }}>
        <h2>Page not found</h2>
        <p className="muted">The page you’re looking for doesn’t exist.</p>
        <Link className="btnPrimary" to="/">
          Go home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
