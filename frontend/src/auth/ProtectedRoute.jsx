import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../api/supabase";

const ProtectedRoute = ({ children }) => {
  const [ok, setOk] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setOk(!!data.session);
    });
  }, []);

  if (ok === null) return null;
  return ok ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
