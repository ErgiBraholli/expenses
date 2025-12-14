import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../api/axios";
import "../styles/app.css";
import "../styles/table.css";

const pad2 = (n) => String(n).padStart(2, "0");
const toYYYYMM = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`;

const prettyMonth = (yyyyMM) => {
  const [y, m] = yyyyMM.split("-").map(Number);
  const d = new Date(y, m - 1, 1);
  return d.toLocaleString(undefined, { month: "long", year: "numeric" });
};

const Dashboard = () => {
  const [months, setMonths] = useState([]);
  const [month, setMonth] = useState("");

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    income: 0,
    expenses: 0,
    net: 0,
    topCategories: [],
  });

  const fmt = (n) =>
    Number(n || 0).toLocaleString(undefined, {
      style: "currency",
      currency: "ALL",
    });

  // 1) Load months that actually exist in transactions
  useEffect(() => {
    const run = async () => {
      try {
        const res = await api.get("/transactions/months");
        const list = res.data?.months || [];

        const current = toYYYYMM(new Date());
        const finalMonths = list.length ? list : [current];

        setMonths(finalMonths);

        // Default selected month:
        // - if current month exists in list, select it
        // - else select the newest month (first item)
        setMonth(finalMonths.includes(current) ? current : finalMonths[0]);
      } catch (e) {
        console.error("Failed to load months", e);
        const current = toYYYYMM(new Date());
        setMonths([current]);
        setMonth(current);
      }
    };

    run();
  }, []);

  // 2) Fetch dashboard stats when selected month changes
  useEffect(() => {
    if (!month) return;

    const run = async () => {
      setLoading(true);
      try {
        const res = await api.get("/dashboard", { params: { month } });
        setStats(res.data);
      } catch (e) {
        console.error("Dashboard fetch error", e);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [month]);

  const monthLabel = useMemo(() => (month ? prettyMonth(month) : ""), [month]);

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
              disabled={!months.length}
              aria-label="Select month"
              title={monthLabel}
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
