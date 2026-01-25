import React, { useState, useEffect } from "react";
import { hospitalsApi, laboratoriesApi, employeesApi } from "../services/api";
import "../styles/HospitalsPage.css";

interface Hospital {
  id: number;
  name: string;
  address: string;
  totalLaboratories?: number;
}

interface Laboratory {
  id: number;
  name: string;
  hospitalId: number;
}

interface Employee {
  id: number;
  fullName: string;
  laboratoryId: number;
}

export function HospitalsPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [laboratories, setLaboratories] = useState<Laboratory[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [statisticsId, setStatisticsId] = useState<number | null>(null);
  const [statistics, setStatistics] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Check if user is Admin
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const parts = token.split(".");
        if (parts.length === 3) {
          const decoded = JSON.parse(atob(parts[1]));
          const role = decoded.role || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
          setIsAdmin(role === "Admin" || (Array.isArray(role) && role.includes("Admin")));
        }
      } catch (e) {
        console.error("Failed to decode token", e);
      }
    }
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
  });

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      setError(null);
      const [hospRes, labRes, empRes] = await Promise.all([
        hospitalsApi.apiHospitalsGet(),
        laboratoriesApi.apiLaboratoriesGet(),
        employeesApi.apiEmployeesGet(),
      ]);
      setHospitals(Array.isArray(hospRes.data) ? hospRes.data : []);
      setLaboratories(Array.isArray(labRes.data) ? labRes.data : []);
      setEmployees(Array.isArray(empRes.data) ? empRes.data : []);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to fetch hospitals";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Hospital name is required");
      return;
    }

    try {
      setCreating(true);
      setError(null);
      await hospitalsApi.apiHospitalsPost({
        name: formData.name.trim(),
        address: formData.address.trim(),
      } as any);

      setFormData({
        name: "",
        address: "",
      });
      setShowForm(false);
      await fetchHospitals();
    } catch (err: any) {
      let errorMsg = "Failed to create hospital";
      if (err.response?.status === 403) {
        errorMsg = "You don't have permission to create hospitals. Only Administrators can create hospitals.";
      } else if (err.response?.status === 401) {
        errorMsg = "You need to be logged in to create hospitals.";
      } else if (err.response?.status === 400) {
        errorMsg = err.response?.data?.message || "Invalid hospital data";
      } else {
        errorMsg = err.response?.data?.message || err.message || "Failed to create hospital";
      }
      setError(errorMsg);
      console.error("Hospital creation error:", err.response?.data || err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this hospital? This action cannot be undone.")) {
      return;
    }

    try {
      setDeleting(id);
      setError(null);
      await hospitalsApi.apiHospitalsIdDelete(id);
      await fetchHospitals();
      setDeleting(null);
    } catch (err: any) {
      let errorMsg = "Failed to delete hospital";
      if (err.response?.status === 403) {
        errorMsg = "You don't have permission to delete hospitals.";
      } else if (err.response?.status === 401) {
        errorMsg = "You need to be logged in to delete hospitals.";
      } else {
        errorMsg = err.response?.data?.message || err.message || errorMsg;
      }
      setError(errorMsg);
      setDeleting(null);
    }
  };

  const handleEditClick = (hospital: Hospital) => {
    setEditingId(hospital.id);
    setFormData({
      name: hospital.name,
      address: hospital.address || "",
    });
    setShowForm(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    
    if (!formData.name.trim()) {
      setError("Hospital name is required");
      return;
    }

    try {
      setCreating(true);
      setError(null);
      await hospitalsApi.apiHospitalsIdPut(editingId, {
        name: formData.name.trim(),
        address: formData.address.trim(),
      } as any);

      await fetchHospitals();
      setFormData({ name: "", address: "" });
      setShowForm(false);
      setEditingId(null);
    } catch (err: any) {
      let errorMsg = "Failed to update hospital";
      if (err.response?.status === 403) {
        errorMsg = "You don't have permission to update hospitals.";
      } else if (err.response?.status === 401) {
        errorMsg = "You need to be logged in to update hospitals.";
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

  const handleViewStatistics = async (hospitalId: number) => {
    try {
      setLoadingStats(true);
      setStatisticsId(hospitalId);
      const res = await hospitalsApi.apiHospitalsIdStatisticsGet(hospitalId);
      setStatistics(res.data);
    } catch (err: any) {
      setError("Failed to load statistics");
      console.error("Statistics error:", err);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      await fetchHospitals();
      return;
    }

    try {
      setLoading(true);
      const res = await hospitalsApi.apiHospitalsSearchGet(term);
      setHospitals(Array.isArray(res.data) ? res.data : []);
    } catch (err: any) {
      console.log("Search API not available, using client-side filtering");
    } finally {
      setLoading(false);
    }
  };

  const filteredHospitals = hospitals.filter((h) =>
    h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="page-section">
      <div className="page-header">
        <h2>Hospitals Management</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowForm(!showForm)}
          disabled={!isAdmin}
          title={!isAdmin ? "Only Administrators can create hospitals" : ""}
        >
          {showForm ? "Cancel" : "+ Add Hospital"}
        </button>
        {!isAdmin && (
          <p className="text-muted" style={{ fontSize: "0.9em", marginTop: "10px" }}>
            Only Administrators can create hospitals
          </p>
        )}
      </div>

      {showForm && (
        <div className="form-card">
          <h3>{editingId ? "Edit Hospital" : "Create New Hospital"}</h3>
          <form onSubmit={editingId ? handleUpdate : handleSubmit} className="hospital-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Hospital Name *</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter hospital name"
                  disabled={creating}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  id="address"
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter address"
                  disabled={creating}
                  required
                />
              </div>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-actions">
              <button type="submit" className="btn btn-success" disabled={creating}>
                {creating ? (editingId ? "Updating..." : "Creating...") : (editingId ? "Update Hospital" : "Create Hospital")}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({ name: "", address: "" });
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
          placeholder="Search hospitals by name or address..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="search-input"
        />
        <span className="result-count">{filteredHospitals.length} results</span>
      </div>

      {/* Statistics Modal */}
      {statisticsId && (
        <div className="modal-overlay" onClick={() => setStatisticsId(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setStatisticsId(null)}>✕</button>
            <h3>Hospital Statistics</h3>
            {loadingStats ? (
              <div className="loading">Loading statistics...</div>
            ) : (
              <div className="statistics-grid">
                {hospitals.find((h) => h.id === statisticsId) && (
                  <>
                    <div className="stat-item">
                      <h4>Hospital ID</h4>
                      <p className="stat-value">{statisticsId}</p>
                    </div>
                    <div className="stat-item">
                      <h4>Hospital Name</h4>
                      <p className="stat-value">{hospitals.find((h) => h.id === statisticsId)?.name}</p>
                    </div>
                    <div className="stat-item">
                      <h4>Total Laboratories</h4>
                      <p className="stat-value">
                        {laboratories.filter((lab) => lab.hospitalId === statisticsId).length}
                      </p>
                    </div>
                    <div className="stat-item">
                      <h4>Total Employees</h4>
                      <p className="stat-value">
                        {
                          employees.filter((emp) => {
                            const labIds = laboratories
                              .filter((lab) => lab.hospitalId === statisticsId)
                              .map((lab) => lab.id);
                            return labIds.includes(emp.laboratoryId);
                          }).length
                        }
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {loading && <div className="loading">Loading hospitals...</div>}

      {!loading && filteredHospitals.length === 0 ? (
        <div className="no-data">No hospitals found</div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Address</th>
                <th>Total Laboratories</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredHospitals.map((hospital) => {
                const labCount = laboratories.filter((lab) => lab.hospitalId === hospital.id).length;
                return (
                <tr key={hospital.id}>
                  <td>{hospital.id}</td>
                  <td className="font-weight-bold">{hospital.name}</td>
                  <td>{hospital.address || "N/A"}</td>
                  <td>{labCount}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => handleViewStatistics(hospital.id)}
                    >
                      Stats
                    </button>
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => handleEditClick(hospital)}
                      disabled={!isAdmin}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(hospital.id)}
                      disabled={deleting === hospital.id || !isAdmin}
                    >
                      {deleting === hospital.id ? "Deleting..." : "Delete"}
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
