import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import CategoryFormModal from "../components/CategoryFormModal";
import api from "../api/axios";
import "../styles/app.css";
import "../styles/table.css";

const Categories = () => {
  const [open, setOpen] = useState(false);
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCats = async () => {
    setLoading(true);
    try {
      const res = await api.get("/categories");
      setCats(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCats().catch(console.error);
  }, []);

  const onDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await api.delete(`/categories/${id}`);
      await fetchCats();
    } catch (err) {
      console.error(err);
      alert("Delete failed.");
    }
  };

  const onAdd = async (data) => {
    try {
      await api.post("/categories", data);
      setOpen(false);
      await fetchCats();
    } catch (err) {
      console.error(err);
      alert("Add failed.");
    }
  };

  return (
    <div className="appShell">
      <Sidebar />

      <main className="main">
        <Navbar
          title="Categories"
          right={
            <button className="btnPrimary" onClick={() => setOpen(true)}>
              + Add Category
            </button>
          }
        />

        <div className="grid2">
          <div className="card">
            <h3 className="cardTitle">Add Category</h3>
            <p className="muted">Click “Add Category” to create a new one.</p>
          </div>

          <div className="card">
            <h3 className="cardTitle">Your Categories</h3>

            {loading ? (
              <p className="muted">Loading categories...</p>
            ) : (
              <div className="tableWrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Type</th>
                      <th className="right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cats.map((c) => (
                      <tr key={c.id}>
                        <td>{c.name}</td>
                        <td>
                          <span className="badge">{c.type}</span>
                        </td>
                        <td className="right">
                          <button
                            className="btnSmall danger"
                            onClick={() => onDelete(c.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}

                    {cats.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="muted">
                          No categories yet.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {open ? (
          <CategoryFormModal onClose={() => setOpen(false)} onSave={onAdd} />
        ) : null}
      </main>
    </div>
  );
};

export default Categories;
