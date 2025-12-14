import { supabase } from "../config/supabaseClient.js";

export const getTransactions = async (req, res) => {
  const { type, category, from, to, q } = req.query;

  let query = supabase
    .from("transactions")
    .select("*")
    .eq("user_id", req.user.id)
    .order("date", { ascending: false });

  if (type && type !== "all") query = query.eq("type", type);
  if (category && category !== "all") query = query.eq("category", category);
  if (from) query = query.gte("date", from);
  if (to) query = query.lte("date", to);
  if (q) query = query.ilike("note", `%${q}%`);

  const { data, error } = await query;
  if (error) return res.status(400).json(error);

  res.json(data);
};

export const createTransaction = async (req, res) => {
  const { date, type, category, note, amount } = req.body;

  const { data, error } = await supabase
    .from("transactions")
    .insert({
      user_id: req.user.id,
      date,
      type,
      category,
      note,
      amount,
    })
    .select()
    .single();

  if (error) return res.status(400).json(error);
  res.json(data);
};

export const updateTransaction = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("transactions")
    .update(req.body)
    .eq("id", id)
    .eq("user_id", req.user.id)
    .select()
    .single();

  if (error) return res.status(400).json(error);
  res.json(data);
};

export const deleteTransaction = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", id)
    .eq("user_id", req.user.id);

  if (error) return res.status(400).json(error);
  res.json({ success: true });
};

export const getTransactionMonths = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all distinct months that have ANY transactions for this user
    const { data, error } = await supabase
      .from("transactions")
      .select("date")
      .eq("user_id", userId)
      .order("date", { ascending: false });

    if (error) throw error;

    const months = Array.from(
      new Set(
        (data || []).map((r) => {
          const d = new Date(r.date);
          const y = d.getFullYear();
          const m = String(d.getMonth() + 1).padStart(2, "0");
          return `${y}-${m}`;
        })
      )
    );

    return res.json({ months });
  } catch (e) {
    console.error("getTransactionMonths error:", e);
    return res.status(500).json({ error: "Failed to fetch months" });
  }
};
