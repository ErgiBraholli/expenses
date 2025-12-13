import { supabase } from "../config/supabaseClient.js";

export const getCategories = async (req, res) => {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", req.user.id)
    .order("created_at", { ascending: false });

  if (error) return res.status(400).json(error);
  res.json(data);
};

export const createCategory = async (req, res) => {
  const { name, type } = req.body;

  const { data, error } = await supabase
    .from("categories")
    .insert({
      user_id: req.user.id,
      name,
      type,
    })
    .select()
    .single();

  if (error) {
    console.log("Categories error:", error);
    return res.status(400).json({ error: error.message });
  }
  res.json(data);
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id)
    .eq("user_id", req.user.id);

  if (error) return res.status(400).json(error);
  res.json({ success: true });
};
