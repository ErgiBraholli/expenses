import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../api/axios";
import { supabase } from "../api/supabase";
import "../styles/app.css";
import "../styles/table.css";

const pad2 = (n) => String(n).padStart(2, "0");
const toYYYYMM = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`;

const monthOptionsFrom = (startYYYYMM) => {
  const [sy, sm] = startYYYYMM.split("-").map(Number);
  const start = new Date(sy, sm - 1, 1);

  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth(), 1);

  const out = [];
  const cur = new Date(start);

  while (cur <= end) {
    out.push(toYYYYMM(cur));
    cur.setMonth(cur.getMonth() + 1);
  }

  return out.reverse(); // latest first
};

const prettyMonth = (yyyyMM) => {
  const [y, m] = yyyyMM.split("-").map(Number);
  const d = new Date(y, m - 1, 1);
  return d.toLocaleString(undefined, { month: "long", year: "numeric" });
};

const Dashboard = () => {
  const [userStartMonth, setUserStartMonth] = useState(null);
  const [month, setMonth] = useState(null);

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    income: 0,
    expenses: 0,
    net: 0,
    topCategories: [],
  });

  const months = useMemo(() => {
    if (!userStartMonth) return [];
    return monthOptionsFrom(userStartMonth);
  }, [userStartMonth]);

  const fmt = (n) =>
    Number(n || 0).toLocaleString(undefined, {
      style: "currency",
      currency: "ALL",
    });

  // Determine start month from account created_at
  useEffect(() => {
    const run = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error(error);
        return;
      }

      const createdAt = data.user?.created_at;
      const start = createdAt
        ? toYYYYMM(new Date(createdAt))
        : toYYYYMM(new Date());

      setUserStartMonth(start);
      setMonth(toYYYYMM(new Date())); // default to current month
    };

    run().catch(console.error);
  }, []);

  // Fetch dashboard stats when month changes
  useEffect(() => {
    if (!month) return;

    const run = async () => {
      setLoading(true);
      try {
        const res = await api.get("/dashboard", { params: { month } });
        setStats(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [month]);

  return (
    <div className="appShell">
      <Sidebar />

      <main className="main">
        <Navbar
          title="Dashboard"
          right={
            <select
              className="select"
              value={month || ""}
              onChange={(e) => setMonth(e.target.value)}
            >
              {months.map((m) => (
                <option key={m} value={m}>
                  {prettyMonth(m)}
                </option>
              ))}
            </select>
          }
        />

        <div className="cardsRow">
          <div className="cardStat">
            <div className="cardLabel">Income</div>
            <div className="cardValue">{fmt(stats.income)}</div>
          </div>

          <div className="cardStat">
            <div className="cardLabel">Expenses</div>
            <div className="cardValue">{fmt(stats.expenses)}</div>
          </div>

          <div className="cardStat">
            <div className="cardLabel">Net</div>
            <div className="cardValue">{fmt(stats.net)}</div>
          </div>
        </div>

        <h2 className="sectionTitle">Top Categories</h2>

        <div className="card">
          {loading ? (
            <p className="muted">Loading dashboard...</p>
          ) : (
            <div className="tableWrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th className="right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.topCategories?.map((c) => (
                    <tr key={c.name}>
                      <td>{c.name}</td>
                      <td className="right">{fmt(c.amount)}</td>
                    </tr>
                  ))}

                  {!stats.topCategories?.length ? (
                    <tr>
                      <td colSpan="2" className="muted">
                        No expense data for this month yet.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
