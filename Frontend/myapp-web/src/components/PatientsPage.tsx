import React, { useState, useEffect } from "react";
import { authApi, patientsApi } from "../services/api";
import "../styles/PatientsPage.css";

interface Patient {
  id: number;
  applicationUserId: string;
  fullName: string;
  egn?: string;
  user?: {
    id: string;
    email: string;
    phoneNumber?: string;
  };
}

interface Hospital {
  id: number;
  name: string;
}

export function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    egn: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const patRes = await patientsApi.apiPatientsGet();
      setPatients(Array.isArray(patRes.data) ? patRes.data : []);
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
    if (!formData.egn.trim()) {
      setError("EGN (National ID) is required for patients");
      return;
    }

    try {
      setCreating(true);
      setError(null);

      // Create patient via Patients API
      await patientsApi.apiPatientsPost({
        fullName: formData.fullName.trim(),
        egn: formData.egn.trim(),
      } as any);

      // Refresh patient list
      await fetchData();

      // Reset form
      setFormData({
        fullName: "",
        egn: "",
      });
      setShowForm(false);
    } catch (err: any) {
      let errorMsg = "Failed to register patient";
      if (err.response?.status === 403) {
        errorMsg = "You don't have permission to register patients. Only Employees and Administrators can register patients.";
      } else if (err.response?.status === 401) {
        errorMsg = "You need to be logged in to register patients.";
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
        errorMsg = err.response?.data?.message || err.message || "Failed to register patient";
      }
      setError(errorMsg);
      console.error("Patient registration error:", err.response?.data || err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this patient? This action cannot be undone.")) {
      return;
    }

    try {
      setDeleting(id);
      setError(null);
      await patientsApi.apiPatientsIdDelete(id);
      await fetchData();
      setDeleting(null);
    } catch (err: any) {
      let errorMsg = "Failed to delete patient";
      if (err.response?.status === 403) {
        errorMsg = "You don't have permission to delete patients.";
      } else if (err.response?.status === 401) {
        errorMsg = "You need to be logged in to delete patients.";
      } else {
        errorMsg = err.response?.data?.message || err.message || errorMsg;
      }
      setError(errorMsg);
      setDeleting(null);
    }
  };

  const handleEditClick = (patient: Patient) => {
    setEditingId(patient.id);
    setFormData({
      fullName: patient.fullName,
      egn: patient.egn || "",
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
    if (!formData.egn.trim()) {
      setError("EGN is required");
      return;
    }

    try {
      setCreating(true);
      setError(null);
      await patientsApi.apiPatientsIdPut(editingId, {
        fullName: formData.fullName.trim(),
        egn: formData.egn.trim(),
      } as any);

      await fetchData();
      setFormData({
        fullName: "",
        egn: "",
      });
      setShowForm(false);
      setEditingId(null);
    } catch (err: any) {
      let errorMsg = "Failed to update patient";
      if (err.response?.status === 403) {
        errorMsg = "You don't have permission to update patients.";
      } else if (err.response?.status === 401) {
        errorMsg = "You need to be logged in to update patients.";
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

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      await fetchData();
      return;
    }

    try {
      setLoading(true);
      const res = await patientsApi.apiPatientsSearchGet(term);
      setPatients(Array.isArray(res.data) ? res.data : []);
    } catch (err: any) {
      console.log("Search API not available, using client-side filtering");
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(
    (p) =>
      p.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.egn?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="page-section">
      <div className="page-header">
        <h2>Patients Management</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Register Patient"}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>{editingId ? "Edit Patient" : "Register New Patient"}</h3>
          <form onSubmit={editingId ? handleUpdate : handleSubmit} className="patient-form">
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

              <div className="form-group">
                <label htmlFor="egn">EGN (National ID) *</label>
                <input
                  id="egn"
                  type="text"
                  name="egn"
                  value={formData.egn}
                  onChange={handleInputChange}
                  placeholder="Enter EGN"
                  disabled={creating}
                  required
                />
              </div>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-actions">
              <button type="submit" className="btn btn-success" disabled={creating}>
                {creating ? (editingId ? "Updating..." : "Registering...") : (editingId ? "Update Patient" : "Register Patient")}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({ fullName: "", egn: "" });
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
          placeholder="Search patients by name or EGN..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="search-input"
        />
        <span className="result-count">{filteredPatients.length} results</span>
      </div>

      {loading && <div className="loading">Loading patients...</div>}

      {!loading && filteredPatients.length === 0 ? (
        <div className="no-data">No patients found</div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>EGN</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr key={patient.id}>
                  <td>{patient.id}</td>
                  <td className="font-weight-bold">{patient.fullName}</td>
                  <td>{patient.egn || "N/A"}</td>
                  <td>{(patient as any).user?.email || "N/A"}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => handleEditClick(patient)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(patient.id)}
                      disabled={deleting === patient.id}
                    >
                      {deleting === patient.id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
