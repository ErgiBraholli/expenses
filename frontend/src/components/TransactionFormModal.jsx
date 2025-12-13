import React, { useEffect, useState } from "react";
import "../styles/modal.css";
import "../styles/app.css";

const empty = {
  date: "",
  type: "expense",
  category: "",
  note: "",
  amount: "",
};

const TransactionFormModal = ({ onClose, onSave, categories, initial }) => {
  const [form, setForm] = useState(empty);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (initial) {
      setForm({
        date: initial.date || "",
        type: initial.type || "expense",
        category: initial.category || "",
        note: initial.note || "",
        amount: initial.amount ?? "",
      });
    } else {
      setForm((p) => ({ ...p, category: categories[0] || "" }));
    }
  }, [initial, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "type" && value === "income" ? { category: "" } : {}),
    }));
    setErr("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErr("");

    if (!form.date) return setErr("Date is required.");

    if (form.type === "expense" && !form.category) {
      return setErr("Category is required.");
    }

    if (!form.amount || Number(form.amount) <= 0) {
      return setErr("Amount must be greater than 0.");
    }

    const payload = {
      ...form,
      category: form.type === "income" ? null : form.category,
      note: form.note?.trim() || "",
      amount: Number(form.amount),
    };

    onSave(payload);
  };

  return (
    <div className="modalOverlay" onMouseDown={onClose}>
      <div className="modalCard" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modalHeader">
          <h3>{initial ? "Edit Transaction" : "Add Transaction"}</h3>
          <button className="iconBtn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modalBody">
          <label className="label">
            Date
            <input
              className="input"
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
            />
          </label>

          <div className="row2">
            <label className="label">
              Type
              <select
                className="select"
                name="type"
                value={form.type}
                onChange={handleChange}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </label>

            {form.type === "expense" && (
              <label className="label">
                Category
                <select
                  className="select"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>

          <div className="row2">
            <label className="label">
              Amount
              <input
                className="input"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="0.00"
                inputMode="decimal"
              />
            </label>

            <label className="label">
              Note
              <input
                className="input"
                name="note"
                value={form.note}
                onChange={handleChange}
                placeholder="Optional"
              />
            </label>
          </div>

          {err ? <div className="error">{err}</div> : null}

          <div className="modalFooter">
            <button type="button" className="btnGhost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btnPrimary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionFormModal;
