import React, { useState } from "react";
import "../styles/modal.css";
import "../styles/app.css";

const CategoryFormModal = ({ onClose, onSave }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("expense");
  const [err, setErr] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return setErr("Name is required.");

    onSave({ name: name.trim(), type });
  };

  return (
    <div className="modalOverlay" onMouseDown={onClose}>
      <div className="modalCard" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modalHeader">
          <h3>Add Category</h3>
          <button className="iconBtn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={submit} className="modalBody">
          <label className="label">
            Name
            <input
              className="input"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErr("");
              }}
              placeholder="e.g. Food"
            />
          </label>

          <label className="label">
            Type
            <select
              className="select"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
              <option value="both">Both</option>
            </select>
          </label>

          {err ? <div className="error">{err}</div> : null}

          <div className="modalFooter">
            <button type="button" className="btnGhost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btnPrimary">
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryFormModal;
