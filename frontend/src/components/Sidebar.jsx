import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../api/supabase";
import "../styles/sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="sidebar">
      <div className="sidebarHeader">
        <div className="brand">Expense Tracker</div>
      </div>

      <nav className="sidebarNav">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? "navItem active" : "navItem"
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/transactions"
          className={({ isActive }) =>
            isActive ? "navItem active" : "navItem"
          }
        >
          Transactions
        </NavLink>

        <NavLink
          to="/categories"
          className={({ isActive }) =>
            isActive ? "navItem active" : "navItem"
          }
        >
          Categories
        </NavLink>
      </nav>

      <div className="sidebarFooter">
        <button className="logoutBtn" onClick={logout}>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
