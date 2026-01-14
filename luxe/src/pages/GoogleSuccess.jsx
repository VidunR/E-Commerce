import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";

export function GoogleSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginWithGoogle } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      loginWithGoogle(token);
      navigate("/");
    } else {
      navigate("/login");
    }
  }, []);

  return <div className="min-h-screen flex items-center justify-center">Signing you in...</div>;
}