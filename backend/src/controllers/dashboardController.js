import { supabase } from "../config/supabaseClient.js";

const nextMonthStart = (monthStr) => {
  const [y, m] = monthStr.split("-").map(Number);
  const d = new Date(y, m - 1, 1);
  d.setMonth(d.getMonth() + 1);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${yyyy}-${mm}-01`;
};

export const getDashboard = async (req, res) => {
  try {
    const { month } = req.query;

    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({ error: "Invalid month. Use YYYY-MM" });
    }

    const start = `${month}-01`;
    const nextStart = nextMonthStart(month);

    const { data, error } = await supabase
      .from("transactions")
      .select("type, amount, date, category")
      .eq("user_id", req.user.id)
      .gte("date", start)
      .lt("date", nextStart);

    if (error) {
      console.log("Dashboard error:", error);
      return res.status(400).json({ error: error.message });
    }

    let income = 0;
    let expenses = 0;
    const grouped = {};

    for (const t of data) {
      const amt = Number(t.amount) || 0;

      if (t.type === "income") income += amt;
      if (t.type === "expense") expenses += amt;

      if (t.type === "expense") {
        const key = t.category || "Uncategorised";
        grouped[key] = (grouped[key] || 0) + amt;
      }
    }

    const top = Object.entries(grouped)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    return res.json({
      income,
      expenses,
      net: income - expenses,
      topCategories: top,
    });
  } catch (e) {
    console.error("Dashboard error:", e);
    return res.status(500).json({ error: "Server error" });
  }
};
