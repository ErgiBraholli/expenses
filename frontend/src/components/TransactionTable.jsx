import React from "react";
import "../styles/table.css";

const TransactionTable = ({ rows, onEdit, onDelete }) => {
  const fmt = (n) =>
    Number(n).toLocaleString(undefined, { style: "currency", currency: "ALL" });

  return (
    <div className="tableWrap">
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Category</th>
            <th>Note</th>
            <th className="right">Amount</th>
            <th className="right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{r.date}</td>
              <td>
                <span className="badge">{r.type}</span>
              </td>
              <td>{r.category}</td>
              <td className="muted">{r.note}</td>
              <td className="right">{fmt(r.amount)}</td>
              <td className="right">
                <button className="btnSmall" onClick={() => onEdit(r)}>
                  Edit
                </button>
                <button
                  className="btnSmall danger"
                  onClick={() => onDelete(r.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {rows.length === 0 ? (
            <tr>
              <td colSpan="6" className="muted">
                No transactions found.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
