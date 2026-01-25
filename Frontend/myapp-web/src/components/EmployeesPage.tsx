import React, { useState, useEffect } from "react";
import { authApi, employeesApi, laboratoriesApi } from "../services/api";
import "../styles/EmployeesPage.css";

interface Employee {
  id: number;
  applicationUserId: string;
  fullName: string;
  email?: string;
  laboratoryId: number;
  laboratory?: {
    id: number;
    name: string;
    hospitalId: number;
    hospitalName?: string;
    totalEmployees?: number;
  };
  user?: {
    id: string;
    email: string;
    phoneNumber?: string;
    userName: string;
  };
}

interface Laboratory {
  id: number;
  name: string;
}

export function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [laboratories, setLaboratories] = useState<Laboratory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [canCreate, setCanCreate] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  // Check if user is Employee or Admin
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const parts = token.split(".");
        if (parts.length === 3) {
          const decoded = JSON.parse(atob(parts[1]));
          const role = decoded.role || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
          const hasRole = role === "Employee" || role === "Admin" || 
                         (Array.isArray(role) && (role.includes("Employee") || role.includes("Admin")));
          setCanCreate(hasRole);
        }
      } catch (e) {
        console.error("Failed to decode token", e);
      }
    }
  }, []);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    laboratoryId: "",
  });
  // ...existing code...

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [empRes, labRes] = await Promise.all([
        employeesApi.apiEmployeesGet(),
        laboratoriesApi.apiLaboratoriesGet(),
      ]);
      console.log("Employees data:", JSON.stringify(empRes.data, null, 2));
      console.log("First employee details:", empRes.data?.[0]);
      
      // Fetch detailed employee info for each employee to get user data
      let employees: any[] = Array.isArray(empRes.data) ? empRes.data : [];
      if (employees.length > 0) {
        const detailedEmployees = await Promise.all(
          employees.map(emp => 
            employeesApi.apiEmployeesIdGet(emp.id)
              .then((res: any) => res.data)
              .catch(() => emp)
          )
        );
        employees = detailedEmployees;
      }
      
      console.log("Detailed employees:", employees);
      setEmployees(employees);
      setLaboratories(Array.isArray(labRes.data) ? labRes.data : []);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to fetch data";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      setError("Full name is required");
      return;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return;
    }
    if (!formData.password.trim()) {
      setError("Password is required");
      return;
    }
    if (!formData.laboratoryId) {
      setError("Please select a laboratory");
      return;
    }

    try {
      setCreating(true);
      setError(null);

      // Register user via Auth API with role "Employee"
      // Backend will automatically create Employee record and link to laboratory
      const registerResponse = await authApi.apiAuthRegisterPost({
        email: formData.email.trim(),
        password: formData.password.trim(),
        role: "Employee",
        fullName: formData.fullName.trim(),
        laboratoryId: parseInt(formData.laboratoryId),
      });

      // Refresh employee list
      await fetchData();

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        password: "",
        phoneNumber: "",
        laboratoryId: "",
      });
      setShowForm(false);

      // Show success message
      setError(null);
      console.log("Employee registered successfully:", registerResponse);
    } catch (err: any) {
      let errorMsg = "Failed to register employee";
      if (err.response?.status === 403) {
        errorMsg = "You don't have permission to register employees. Only Employees and Administrators can register employees.";
      } else if (err.response?.status === 401) {
        errorMsg = "You need to be logged in to register employees.";
      } else if (err.response?.status === 400) {
        if (err.response?.data?.message) {
          errorMsg = err.response.data.message;
        } else if (err.response?.data?.errors) {
          const errors = err.response.data.errors;
          if (typeof errors === "object") {
            errorMsg = Object.entries(errors)
              .map(([key, value]) => `${key}: ${value}`)
              .join(", ");
          } else {
            errorMsg = errors;
          }
        }
      } else {
        errorMsg = err.response?.data?.message || err.message || "Failed to register employee";
      }
      setError(errorMsg);
      console.error("Employee registration error:", err.response?.data || err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this employee? This action cannot be undone.")) {
      return;
    }

    try {
      setDeleting(id);
      setError(null);
      await employeesApi.apiEmployeesIdDelete(id);
      await fetchData();
      setDeleting(null);
    } catch (err: any) {
      let errorMsg = "Failed to delete employee";
      if (err.response?.status === 403) {
        errorMsg = "You don't have permission to delete employees.";
      } else if (err.response?.status === 401) {
        errorMsg = "You need to be logged in to delete employees.";
      } else {
        errorMsg = err.response?.data?.message || err.message || errorMsg;
      }
      setError(errorMsg);
      setDeleting(null);
    }
  };

  const handleEditClick = (emp: Employee) => {
    const empAny = emp as any;
    setEditingId(emp.id);
    setFormData({
      fullName: emp.fullName,
      email: empAny.email || empAny.user?.email || "",
      password: "",
      phoneNumber: empAny.user?.phoneNumber || "",
      laboratoryId: emp.laboratoryId.toString(),
    });
    setShowForm(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    
    if (!formData.fullName.trim()) {
      setError("Full name is required");
      return;
    }
    if (!formData.laboratoryId) {
      setError("Please select a laboratory");
      return;
    }

    try {
      setCreating(true);
      setError(null);
      await employeesApi.apiEmployeesIdPut(editingId, {
        fullName: formData.fullName.trim(),
        laboratoryId: parseInt(formData.laboratoryId),
      } as any);

      await fetchData();
      setFormData({
        fullName: "",
        email: "",
        password: "",
        phoneNumber: "",
        laboratoryId: "",
      });
      setShowForm(false);
      setEditingId(null);
    } catch (err: any) {
      let errorMsg = "Failed to update employee";
      if (err.response?.status === 403) {
        errorMsg = "You don't have permission to update employees.";
      } else if (err.response?.status === 401) {
        errorMsg = "You need to be logged in to update employees.";
      } else if (err.response?.status === 400) {
        errorMsg = err.response?.data?.message || "Validation error";
      } else {
        errorMsg = err.message || errorMsg;
      }
      setError(errorMsg);
    } finally {
      setCreating(false);
    }
  };

  const filteredEmployees = employees.filter(
    (e) =>
      e.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e as any).user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="page-section">
      <div className="page-header">
        <h2>Employees Management</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowForm(!showForm)}
          disabled={!canCreate}
          title={!canCreate ? "Only Employees and Administrators can register employees" : ""}
        >
          {showForm ? "Cancel" : "+ Add Employee"}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>{editingId ? "Edit Employee" : "Register New Employee"}</h3>
          <form onSubmit={editingId ? handleUpdate : handleSubmit} className="employee-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="fullName">Full Name *</label>
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  disabled={creating}
                  required
                />
              </div>

              {!editingId && (
                <>
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter email"
                      disabled={creating}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="password">Password *</label>
                    <input
                      id="password"
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter password"
                      disabled={creating}
                      required
                    />
                  </div>
                </>
              )}

              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  id="phoneNumber"
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Enter phone number (optional)"
                  disabled={creating}
                />
              </div>

              <div className="form-group">
                <label htmlFor="laboratoryId">Laboratory *</label>
                <select
                  id="laboratoryId"
                  name="laboratoryId"
                  value={formData.laboratoryId}
                  onChange={handleInputChange}
                  disabled={creating}
                  required
                >
                  <option value="">Select a laboratory</option>
                  {laboratories.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-actions">
              <button type="submit" className="btn btn-success" disabled={creating}>
                {creating ? (editingId ? "Updating..." : "Registering...") : (editingId ? "Update Employee" : "Register Employee")}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({ fullName: "", email: "", password: "", phoneNumber: "", laboratoryId: "" });
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search employees by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <span className="result-count">{filteredEmployees.length} results</span>
      </div>

      {loading && <div className="loading">Loading employees...</div>}

      {!loading && filteredEmployees.length === 0 ? (
        <div className="no-data">No employees found</div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Laboratory</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp) => {
                const empAny = emp as any;
                const laboratory = laboratories.find((l) => l.id === emp.laboratoryId);
                const labName = laboratory?.name || "N/A";
                
                return (
                  <tr key={emp.id}>
                    <td>{emp.id}</td>
                    <td className="font-weight-bold">{emp.fullName}</td>
                    <td>{labName}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-info"
                        onClick={() => handleEditClick(emp)}
                        disabled={canCreate === false}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(emp.id)}
                        disabled={deleting === emp.id || canCreate === false}
                      >
                        {deleting === emp.id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
