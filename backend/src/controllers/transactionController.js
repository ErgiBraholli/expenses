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
