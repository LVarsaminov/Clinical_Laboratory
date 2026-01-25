import React, { useState, useEffect } from "react";
import { authApi, laboratoriesApi } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import "../styles/LoginPage.css";

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  // Login fields
  const [email, setEmail] = useState("admin@lab.com");
  const [password, setPassword] = useState("Admin@123");
  const [showPassword, setShowPassword] = useState(false);

  // Register fields
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regFullName, setRegFullName] = useState("");
  const [regEgn, setRegEgn] = useState("");
  const [regRole, setRegRole] = useState<"Employee" | "Patient">("Patient");
  const [regLaboratoryId, setRegLaboratoryId] = useState("");
  const [laboratories, setLaboratories] = useState<any[]>([]);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [loadingLaboratories, setLoadingLaboratories] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLogin && regRole === "Employee") {
      fetchLaboratories();
    }
  }, [isLogin, regRole]);

  const fetchLaboratories = async () => {
    try {
      setLoadingLaboratories(true);

      const res = await laboratoriesApi.apiLaboratoriesGet();

      // 🔧 FIX: Swagger client returns `never`, so cast once safely
      const data = res.data as any;

      const labs = Array.isArray(data)
        ? data
        : data?.items || data?.data || [];

      setLaboratories(labs);
      console.log("Laboratories loaded:", labs);
    } catch (err) {
      console.error("Failed to fetch laboratories", err);
      setLaboratories([]);
    } finally {
      setLoadingLaboratories(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const res = await authApi.apiAuthLoginPost({
        email: email.trim(),
        password,
      });

      const loginData = res.data as any;
      if (loginData?.token) {
        login(loginData.token);
        onLoginSuccess();
      } else {
        setError("No token received from server");
      }
    } catch (err: any) {
      let errorMessage = "Login failed";
      if (err.response?.status === 401) {
        errorMessage = "Invalid email or password";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else {
        errorMessage = err.message || "Login failed";
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      if (!regFullName.trim()) {
        setError("Full name is required");
        return;
      }

      if (regFullName.trim().split(" ").length < 2) {
        setError("Please provide both first and last name");
        return;
      }

      if (regPassword !== regConfirmPassword) {
        setError("Passwords do not match");
        return;
      }

      if (regRole === "Employee" && !regLaboratoryId) {
        setError("Laboratory is required for employees");
        return;
      }

      const registrationData: any = {
        email: regEmail.trim(),
        password: regPassword,
        role: regRole,
        fullName: regFullName.trim(),
        egn: regEgn.trim() || null,
      };

      if (regRole === "Employee") {
        registrationData.laboratoryId = Number(regLaboratoryId);
      }

      await authApi.apiAuthRegisterPost(registrationData);

      setSuccess("Registration successful! Logging you in...");

      const loginRes = await authApi.apiAuthLoginPost({
        email: regEmail.trim(),
        password: regPassword,
      });

      const loginData = loginRes.data as any;
      if (loginData?.token) {
        login(loginData.token);
        onLoginSuccess();
      }
    } catch (err: any) {
      let errorMessage = "Registration failed";
      if (err.response?.status === 409) {
        errorMessage = "Email already registered";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else {
        errorMessage = err.message || "Registration failed";
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>Clinical Laboratory</h1>
          <h2>Management System</h2>
          <p>Professional Laboratory Management</p>
        </div>

        <div className="auth-tabs">
          <button
            className={`tab-btn ${isLogin ? "active" : ""}`}
            onClick={() => {
              setIsLogin(true);
              setError(null);
              setSuccess(null);
            }}
            disabled={loading}
          >
            Login
          </button>
          <button
            className={`tab-btn ${!isLogin ? "active" : ""}`}
            onClick={() => {
              setIsLogin(false);
              setError(null);
              setSuccess(null);
            }}
            disabled={loading}
          >
            Register
          </button>
        </div>

        {/* LOGIN FORM */}
        {isLogin && (
          <form onSubmit={handleLoginSubmit} className="login-form">
            <div className="form-group">
              <label>Email</label>
              <input value={email} onChange={e => setEmail(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            {error && <div className="alert alert-error">{error}</div>}
            <button type="submit" className="btn btn-primary btn-full">
              Login
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {!isLogin && (
          <form onSubmit={handleRegisterSubmit} className="login-form">
            <div className="form-group">
              <label>Email *</label>
              <input value={regEmail} onChange={e => setRegEmail(e.target.value)} required />
            </div>

            <div className="form-group">
              <label>Full Name *</label>
              <input value={regFullName} onChange={e => setRegFullName(e.target.value)} required />
            </div>

            <div className="form-group">
              <label>Role *</label>
              <select
                value={regRole}
                onChange={(e) => {
                  setRegRole(e.target.value as "Employee" | "Patient");
                  setRegLaboratoryId("");
                }}
              >
                <option value="Patient">Patient</option>
                <option value="Employee">Employee</option>
              </select>
            </div>

            {regRole === "Employee" && (
              <div className="form-group">
                <label>Laboratory *</label>
                <select
                  value={regLaboratoryId}
                  onChange={e => setRegLaboratoryId(e.target.value)}
                  disabled={loadingLaboratories}
                  required
                >
                  <option value="">
                    {loadingLaboratories ? "Loading laboratories..." : "Select laboratory"}
                  </option>
                  {laboratories.map((lab: any) => (
                    <option key={lab.id} value={lab.id}>
                      {lab.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {error && <div className="alert alert-error">{error}</div>}
            <button type="submit" className="btn btn-primary btn-full">
              Register
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
