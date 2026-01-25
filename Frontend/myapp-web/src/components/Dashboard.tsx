import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { patientsApi, testsApi, employeesApi, authApi } from "../services/api";
import "../styles/Dashboard.css";

export function Dashboard() {
  const { userRole } = useAuth();
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [showTestForm, setShowTestForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isPatient = userRole === "Patient";
  const isEmployee = userRole === "Employee";

  // Patient Form State
  const [patientFormData, setPatientFormData] = useState({ fullName: "", egn: "" });

  // Test Form State
  const [testFormData, setTestFormData] = useState({
    patientId: "",
    serviceId: "",
    employeeId: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleRegisterPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!patientFormData.fullName.trim()) {
      setError("Full name is required");
      return;
    }
    if (!patientFormData.egn.trim()) {
      setError("EGN (National ID) is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const fullNameParts = patientFormData.fullName.trim().split(" ");
      const firstName = fullNameParts[0];
      const lastName = fullNameParts.length > 1 ? fullNameParts.slice(1).join(" ") : firstName;

      // Generate a temporary email and password for the patient account
      const tempEmail = `patient_${Date.now()}@localhost.local`;
      const tempPassword = `Patient@${Math.random().toString(36).substring(2, 10)}`;

      const patientPayload = {
        email: tempEmail,
        password: tempPassword,
        role: "Patient",
        fullName: patientFormData.fullName.trim(),
        egn: patientFormData.egn.trim(),
      };

      console.log("Registering patient with data:", patientPayload);

      const response = await authApi.apiAuthRegisterPost(patientPayload as any);

      console.log("Patient registered successfully:", response.data);
      setSuccess("Patient registered successfully!");
      setPatientFormData({ fullName: "", egn: "" });
      setShowPatientForm(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error("Patient registration error details:", {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.message,
      });
      
      let errorMsg = "Failed to register patient";
      
      if (err.response?.status === 403) {
        errorMsg = "You don't have permission to register patients. Please contact an administrator.";
      } else if (err.response?.status === 401) {
        errorMsg = "Your session has expired. Please log in again.";
      } else if (err.response?.status === 400) {
        // Try to extract detailed error information
        const responseData = err.response?.data;
        if (typeof responseData === 'string') {
          errorMsg = responseData;
        } else if (responseData?.message) {
          errorMsg = responseData.message;
        } else if (responseData?.errors) {
          // Handle validation errors object
          if (typeof responseData.errors === 'object') {
            errorMsg = Object.entries(responseData.errors)
              .map(([key, value]: any) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
              .join(" | ");
          } else {
            errorMsg = responseData.errors;
          }
        } else {
          errorMsg = "Invalid patient data. Please check all fields.";
        }
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testFormData.patientId || !testFormData.serviceId || !testFormData.employeeId) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await testsApi.apiTestsPost({
        patientId: parseInt(testFormData.patientId),
        serviceId: parseInt(testFormData.serviceId),
        employeeId: parseInt(testFormData.employeeId),
        date: testFormData.date,
      } as any);
      setSuccess("Medical test registered successfully!");
      setTestFormData({
        patientId: "",
        serviceId: "",
        employeeId: "",
        date: new Date().toISOString().split("T")[0],
      });
      setShowTestForm(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to register test");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="dashboard-section">
      <div className="dashboard-header">
        <h1>Welcome to Clinical Laboratory Management System</h1>
        {isPatient && <p>Access your medical test results and information</p>}
        {isEmployee && <p>Quick access to register patients and create medical tests</p>}
      </div>

      {/* Patient Dashboard */}
      {isPatient && (
        <div className="dashboard-content">
          <div className="dashboard-section-card"
            style={{ padding: "20px", marginBottom: "20px" }}
          >
            <h2>Welcome, Patient!</h2>
            <p>
              You can view all your registered medical tests in the <strong>"My Tests"</strong>{" "}
              tab. Your tests will show status, results, and cost information.
            </p>
            <div style={{ marginTop: "15px", color: "#666", fontSize: "0.9em" }}>
              <p>• View all your medical tests</p>
              <p>• Track test status (Pending, In Progress, Completed)</p>
              <p>• Access test results when ready</p>
              <p>• View payment status</p>
            </div>
          </div>
        </div>
      )}

      {/* Employee Dashboard */}
      {isEmployee && (
        <div className="dashboard-content">
          <div className="dashboard-section-card">
            <h2>Quick Patient Registration</h2>
            {showPatientForm ? (
              <form onSubmit={handleRegisterPatient} className="quick-form">
                {error && <div className="alert alert-error" style={{ marginBottom: "15px" }}>{error}</div>}
                
                <div className="form-group">
                  <label htmlFor="fullName">Full Name *</label>
                  <input
                    id="fullName"
                    type="text"
                    value={patientFormData.fullName}
                    onChange={(e) =>
                      setPatientFormData({ ...patientFormData, fullName: e.target.value })
                    }
                    placeholder="John Doe"
                    disabled={loading}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="egn">EGN (National ID) *</label>
                  <input
                    id="egn"
                    type="text"
                    value={patientFormData.egn}
                    onChange={(e) =>
                      setPatientFormData({ ...patientFormData, egn: e.target.value })
                    }
                    placeholder="1234567890"
                    disabled={loading}
                    required
                  />
                </div>
                <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={loading}
                  >
                    {loading ? "Registering..." : "Register Patient"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowPatientForm(false);
                      setError(null);
                    }}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => {
                  setShowPatientForm(true);
                  setError(null);
                  setSuccess(null);
                }}
                style={{ fontSize: "1.1em", padding: "12px 24px" }}
              >
                + Register New Patient
              </button>
            )}
          </div>

          <div className="dashboard-section-card">
            <h2>Quick Medical Test Registration</h2>
            {showTestForm ? (
              <form onSubmit={handleRegisterTest} className="quick-form">
                <div className="form-group">
                  <label htmlFor="testPatientId">Patient ID *</label>
                  <input
                    id="testPatientId"
                    type="number"
                    value={testFormData.patientId}
                    onChange={(e) =>
                      setTestFormData({ ...testFormData, patientId: e.target.value })
                    }
                    placeholder="Patient ID"
                    disabled={loading}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="testServiceId">Service ID *</label>
                  <input
                    id="testServiceId"
                    type="number"
                    value={testFormData.serviceId}
                    onChange={(e) =>
                      setTestFormData({ ...testFormData, serviceId: e.target.value })
                    }
                    placeholder="Service ID"
                    disabled={loading}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="testEmployeeId">Employee ID *</label>
                  <input
                    id="testEmployeeId"
                    type="number"
                    value={testFormData.employeeId}
                    onChange={(e) =>
                      setTestFormData({ ...testFormData, employeeId: e.target.value })
                    }
                    placeholder="Your Employee ID"
                    disabled={loading}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="testDate">Collection Date</label>
                  <input
                    id="testDate"
                    type="date"
                    value={testFormData.date}
                    onChange={(e) =>
                      setTestFormData({ ...testFormData, date: e.target.value })
                    }
                    disabled={loading}
                  />
                </div>
                <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={loading}
                  >
                    {loading ? "Registering..." : "Register Test"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowTestForm(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => setShowTestForm(true)}
                style={{ fontSize: "1.1em", padding: "12px 24px" }}
              >
                + Register New Medical Test
              </button>
            )}
          </div>
        </div>
      )}

      {/* Messages */}
      {error && (
        <div className="alert alert-error" style={{ marginTop: "20px" }}>
          {error}
        </div>
      )}
      {success && (
        <div className="alert alert-success" style={{ marginTop: "20px" }}>
          {success}
        </div>
      )}
    </section>
  );
}
