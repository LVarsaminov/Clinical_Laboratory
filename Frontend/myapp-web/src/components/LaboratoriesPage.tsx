import React, { useState, useEffect } from "react";
import { laboratoriesApi, hospitalsApi, employeesApi } from "../services/api";
import "../styles/LaboratoriesPage.css";
import axios, { AxiosResponse } from "axios";

interface Laboratory {
  id: number;
  hospitalId: number;
  name: string;
  hospitalName?: string;
  totalEmployees?: number;
  employees?: Array<{
    id: number;
    fullName: string;
    email: string;
  }>;
}

interface Hospital {
  id: number;
  name: string;
}

interface Employee {
  id: number;
  fullName: string;
  laboratoryId: number;
}

export function LaboratoriesPage() {
  const [laboratories, setLaboratories] = useState<Laboratory[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [canCreate, setCanCreate] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [statisticsId, setStatisticsId] = useState<number | null>(null);
  const [statistics, setStatistics] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(false);

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
    name: "",
    hospitalId: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (showForm) {
      fetchHospitals();
    }
  }, [showForm]);

  const fetchHospitals = async () => {
    try {
      const res = await hospitalsApi.apiHospitalsGet();
      setHospitals(Array.isArray(res.data) ? res.data : []);
      console.log("Hospitals loaded:", res.data);
    } catch (err: any) {
      console.error("Failed to fetch hospitals", err);
      setHospitals([]);
    }
  };

 const fetchData = async () => {
  try {
    setLoading(true);
    setError(null);

    // These already return AxiosPromise<void>, you just await them
    const labRes = await laboratoriesApi.apiLaboratoriesGet();
    const hospRes = await hospitalsApi.apiHospitalsGet();
    const empRes = await employeesApi.apiEmployeesGet();

    // Extract data
    const labs = Array.isArray(labRes.data) ? labRes.data : [];
    const hospitals = Array.isArray(hospRes.data) ? hospRes.data : [];
    const employees = Array.isArray(empRes.data) ? empRes.data : [];

    setLaboratories(labs);
    setHospitals(hospitals);
    setEmployees(employees);

    console.log("Labs:", labs);
    console.log("Hospitals:", hospitals);
    console.log("Employees:", employees);
  } catch (err: any) {
    const errorMsg = err.response?.data?.message || err.message || "Failed to fetch data";
    setError(errorMsg);
    console.error("Fetch data error:", err);
  } finally {
    setLoading(false);
  }
};

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Laboratory name is required");
      return;
    }
    if (!formData.hospitalId) {
      setError("Please select a hospital");
      return;
    }

    try {
      setCreating(true);
      setError(null);
      await laboratoriesApi.apiLaboratoriesPost({
        name: formData.name.trim(),
        hospitalId: parseInt(formData.hospitalId),
      } as any);

      setFormData({
        name: "",
        hospitalId: "",
      });
      setShowForm(false);
      await fetchData();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to create laboratory";
      setError(errorMsg);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this laboratory?")) {
      return;
    }
    try {
      setDeleting(id);
      await laboratoriesApi.apiLaboratoriesIdDelete(id);
      await fetchData();
      setDeleting(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete laboratory");
      setDeleting(null);
    }
  };

  const handleEditClick = (lab: Laboratory) => {
    setEditingId(lab.id);
    setFormData({ name: lab.name, hospitalId: lab.hospitalId.toString() });
    setShowForm(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !formData.name.trim() || !formData.hospitalId) {
      setError("All fields are required");
      return;
    }
    try {
      setCreating(true);
      await laboratoriesApi.apiLaboratoriesIdPut(editingId, {
        name: formData.name.trim(),
        hospitalId: parseInt(formData.hospitalId),
      } as any);
      await fetchData();
      setFormData({ name: "", hospitalId: "" });
      setShowForm(false);
      setEditingId(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update laboratory");
    } finally {
      setCreating(false);
    }
  };

  const filteredLaboratories = laboratories.filter((l) =>
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.hospitalName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewStatistics = async (labId: number) => {
    try {
      setLoadingStats(true);
      setStatisticsId(labId);
      const res = await laboratoriesApi.apiLaboratoriesIdStatisticsGet(labId);
      setStatistics(res.data);
    } catch (err: any) {
      setError("Failed to load statistics");
      console.error("Statistics error:", err);
    } finally {
      setLoadingStats(false);
    }
  };

  return (
    <section className="page-section">
      <div className="page-header">
        <h2>Laboratories Management</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowForm(!showForm)}
          disabled={!canCreate}
          title={!canCreate ? "Only Employees and Administrators can create laboratories" : ""}
        >
          {showForm ? "Cancel" : "+ Add Laboratory"}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>{editingId ? "Edit Laboratory" : "Create New Laboratory"}</h3>
          <form onSubmit={editingId ? handleUpdate : handleSubmit} className="lab-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Laboratory Name *</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter laboratory name"
                  disabled={creating}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="hospitalId">Hospital *</label>
                <select
                  id="hospitalId"
                  name="hospitalId"
                  value={formData.hospitalId}
                  onChange={handleInputChange}
                  disabled={creating}
                  required
                >
                  <option value="">
                    {hospitals.length === 0 ? "Loading hospitals..." : "Select a hospital"}
                  </option>
                  {hospitals && hospitals.length > 0 ? (
                    hospitals.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>No hospitals available</option>
                  )}
                </select>
              </div>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-actions">
              <button type="submit" className="btn btn-success" disabled={creating}>
                {creating ? (editingId ? "Updating..." : "Creating...") : (editingId ? "Update Laboratory" : "Create Laboratory")}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({ name: "", hospitalId: "" });
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
          placeholder="Search laboratories by name or address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <span className="result-count">{filteredLaboratories.length} results</span>
      </div>

      {/* Statistics Modal */}
      {statisticsId && (
        <div className="modal-overlay" onClick={() => setStatisticsId(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setStatisticsId(null)}>✕</button>
            <h3>Laboratory Statistics</h3>
            {loadingStats ? (
              <div className="loading">Loading statistics...</div>
            ) : (
              <div className="statistics-grid">
                {laboratories.find((l) => l.id === statisticsId) && (
                  <>
                    <div className="stat-item">
                      <h4>Laboratory ID</h4>
                      <p className="stat-value">{statisticsId}</p>
                    </div>
                    <div className="stat-item">
                      <h4>Laboratory Name</h4>
                      <p className="stat-value">{laboratories.find((l) => l.id === statisticsId)?.name}</p>
                    </div>
                    <div className="stat-item">
                      <h4>Hospital Name</h4>
                      <p className="stat-value">
                        {hospitals.find((h) => h.id === laboratories.find((l) => l.id === statisticsId)?.hospitalId)?.name || "N/A"}
                      </p>
                    </div>
                    <div className="stat-item">
                      <h4>Total Employees</h4>
                      <p className="stat-value">
                        {employees.filter((emp) => emp.laboratoryId === statisticsId).length}
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {loading && <div className="loading">Loading laboratories...</div>}

      {!loading && filteredLaboratories.length === 0 ? (
        <div className="no-data">No laboratories found</div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Hospital</th>
                <th>Total Employees</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLaboratories.map((lab) => {
                const hospital = hospitals.find((h) => h.id === lab.hospitalId);
                const empCount = employees.filter((emp) => emp.laboratoryId === lab.id).length;
                return (
                <tr key={lab.id}>
                  <td>{lab.id}</td>
                  <td className="font-weight-bold">{lab.name}</td>
                  <td>{hospital?.name || "N/A"}</td>
                  <td>{empCount}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => handleViewStatistics(lab.id)}
                    >
                      Stats
                    </button>
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => handleEditClick(lab)}
                      disabled={!canCreate}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(lab.id)}
                      disabled={deleting === lab.id || !canCreate}
                    >
                      {deleting === lab.id ? "Deleting..." : "Delete"}
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
