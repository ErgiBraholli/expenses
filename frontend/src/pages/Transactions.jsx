import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import FiltersBar from "../components/FiltersBar";
import TransactionTable from "../components/TransactionTable";
import TransactionFormModal from "../components/TransactionFormModal";
import api from "../api/axios";
import "../styles/app.css";

const Transactions = () => {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [filters, setFilters] = useState({
    from: "",
    to: "",
    type: "all",
    category: "all",
    q: "",
  });

  const [categories, setCategories] = useState([]); // from backend
  const [rows, setRows] = useState([]); // from backend
  const [loading, setLoading] = useState(true);

  const categoryNames = useMemo(
    () => categories.map((c) => c.name),
    [categories]
  );

  const fetchCategories = async () => {
    const res = await api.get("/categories");
    setCategories(res.data);
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await api.get("/transactions", { params: filters });
      setRows(res.data);
    } finally {
      setLoading(false);
    }
  };

  // load categories once
  useEffect(() => {
    fetchCategories().catch(console.error);
  }, []);

  // load transactions whenever filters change
  useEffect(() => {
    fetchTransactions().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.from, filters.to, filters.type, filters.category, filters.q]);

  const onAdd = () => {
    setEditing(null);
    setOpen(true);
  };

  const onEdit = (row) => {
    setEditing(row);
    setOpen(true);
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;

    try {
      await api.delete(`/transactions/${id}`);
      await fetchTransactions();
    } catch (err) {
      console.error(err);
      alert("Delete failed.");
    }
  };

  const onSave = async (data) => {
    try {
      if (editing) {
        await api.patch(`/transactions/${editing.id}`, data);
      } else {
        await api.post("/transactions", data);
      }

      setOpen(false);
      setEditing(null);

      await fetchTransactions();
    } catch (err) {
      console.error(err);
      alert("Save failed.");
    }
  };

  return (
    <div className="appShell">
      <Sidebar />

      <main className="main">
        <Navbar
          title="Transactions"
          right={
            <button className="btnPrimary" onClick={onAdd}>
              + Add Transaction
            </button>
          }
        />

        <FiltersBar
          filters={filters}
          setFilters={setFilters}
          categories={categoryNames}
        />

        <div className="card">
          {loading ? (
            <p className="muted">Loading transactions...</p>
          ) : (
            <TransactionTable rows={rows} onEdit={onEdit} onDelete={onDelete} />
          )}
        </div>

        {open ? (
          <TransactionFormModal
            onClose={() => {
              setOpen(false);
              setEditing(null);
            }}
            onSave={onSave}
            categories={categoryNames.length ? categoryNames : ["General"]}
            initial={editing}
          />
        ) : null}
      </main>
    </div>
  );
};

export default Transactions;
