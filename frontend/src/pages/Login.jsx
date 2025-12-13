import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../api/supabase";
import "../styles/app.css";

const Login = () => {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErr("");
    setMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");

    if (!form.email || !form.password) {
      setErr("Please enter email and password.");
      return;
    }

    if (form.password.length < 6) {
      setErr("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (error) throw error;

        navigate("/", { replace: true });
      } else {
        // Create account
        const { data, error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
        });
        if (error) throw error;

        // If email confirmations are ON, user must verify email first
        const needsEmailConfirm = !data.session;

        if (needsEmailConfirm) {
          setMsg(
            "Account created. Please check your email to confirm, then sign in."
          );
          setMode("login");
        } else {
          // If confirmations are OFF, they may be logged in instantly
          navigate("/", { replace: true });
        }
      }
    } catch (e2) {
      setErr(e2?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authPage">
      <div className="authCard">
        <h1 className="authTitle">Expense Tracker</h1>
        <p className="authSubtitle">
          {mode === "login" ? "Sign in to continue" : "Create your account"}
        </p>

        <form onSubmit={handleSubmit} className="authForm">
          <label className="label">
            Email
            <input
              className="input"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </label>

          <label className="label">
            Password
            <input
              className="input"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
            />
          </label>

          {err ? <div className="error">{err}</div> : null}
          {msg ? <div className="success">{msg}</div> : null}

          <button className="btnPrimary" type="submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Sign In"
              : "Create Account"}
          </button>

          <button
            type="button"
            className="btnGhost"
            onClick={() => {
              setMode((p) => (p === "login" ? "signup" : "login"));
              setErr("");
              setMsg("");
            }}
          >
            {mode === "login" ? "Create account" : "Back to sign in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
