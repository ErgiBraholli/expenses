import React from "react";
import "../styles/app.css";

const FiltersBar = ({ filters, setFilters, categories }) => {
  const update = (key, value) => setFilters((p) => ({ ...p, [key]: value }));

  return (
    <div className="filtersBar">
      <div className="filterItem">
        <label className="smallLabel">From</label>
        <input
          className="input"
          type="date"
          value={filters.from}
          onChange={(e) => update("from", e.target.value)}
        />
      </div>

      <div className="filterItem">
        <label className="smallLabel">To</label>
        <input
          className="input"
          type="date"
          value={filters.to}
          onChange={(e) => update("to", e.target.value)}
        />
      </div>

      <div className="filterItem">
        <label className="smallLabel">Type</label>
        <select
          className="select"
          value={filters.type}
          onChange={(e) => update("type", e.target.value)}
        >
          <option value="all">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      <div className="filterItem">
        <label className="smallLabel">Category</label>
        <select
          className="select"
          value={filters.category}
          onChange={(e) => update("category", e.target.value)}
        >
          <option value="all">All</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="filterItem grow">
        <label className="smallLabel">Search</label>
        <input
          className="input"
          value={filters.q}
          onChange={(e) => update("q", e.target.value)}
          placeholder="Search notes..."
        />
      </div>

      <button
        className="btnGhost"
        onClick={() =>
          setFilters({ from: "", to: "", type: "all", category: "all", q: "" })
        }
      >
        Reset
      </button>
    </div>
  );
};

export default FiltersBar;
