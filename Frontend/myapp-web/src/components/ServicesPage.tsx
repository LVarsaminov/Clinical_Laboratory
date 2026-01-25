import React, { useState, useEffect } from "react";
import { servicesApi } from "../services/api";
import "../styles/ServicesPage.css";

interface Service {
  id: number;
  name: string;
  price: number;
}

export function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await servicesApi.apiServicesGet();
      setServices(Array.isArray(res.data) ? res.data : []);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to fetch services");
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
      setError("Service name is required");
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError("Service price must be greater than 0");
      return;
    }

    try {
      setCreating(true);
      setError(null);

      await servicesApi.apiServicesPost({
        name: formData.name.trim(),
        price: parseFloat(formData.price),
      } as any);

      setFormData({ name: "", price: "" });
      setShowForm(false);
      await fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to create service");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    try {
      setDeleting(id);
      await servicesApi.apiServicesIdDelete(id);
      await fetchData();
      setDeleting(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete service");
      setDeleting(null);
    }
  };

  const handleEditClick = (service: Service) => {
    setEditingId(service.id);
    setFormData({ name: service.name, price: service.price.toString() });
    setShowForm(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !formData.name.trim() || parseFloat(formData.price) <= 0) {
      setError("All fields are required and price must be greater than 0");
      return;
    }

    try {
      setCreating(true);
      await servicesApi.apiServicesIdPut(editingId, {
        id: editingId,
        name: formData.name.trim(),
        price: parseFloat(formData.price),
      } as any);

      setFormData({ name: "", price: "" });
      setShowForm(false);
      setEditingId(null);
      await fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update service");
    } finally {
      setCreating(false);
    }
  };

  const filteredServices = services.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="page-section">
      <div className="page-header">
        <h2>Laboratory Services Management</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Add Service"}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>{editingId ? "Edit Service" : "Create New Service"}</h3>
          <form onSubmit={editingId ? handleUpdate : handleSubmit} className="service-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Service Name *</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter service name"
                  disabled={creating}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="price">Price *</label>
                <input
                  id="price"
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Enter price"
                  disabled={creating}
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-actions">
              <button type="submit" className="btn btn-success" disabled={creating}>
                {creating ? (editingId ? "Updating..." : "Creating...") : (editingId ? "Update Service" : "Create Service")}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({ name: "", price: "" });
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
          placeholder="Search services by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <span className="result-count">{filteredServices.length} results</span>
      </div>

      {loading && <div className="loading">Loading services...</div>}

      {!loading && filteredServices.length === 0 ? (
        <div className="no-data">No services found</div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Service Name</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.map((service) => (
                <tr key={service.id}>
                  <td>{service.id}</td>
                  <td className="font-weight-bold">{service.name}</td>
                  <td>${service.price.toFixed(2)}</td>
                  <td>
                    <button className="btn btn-sm btn-info" onClick={() => handleEditClick(service)}>
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(service.id)}
                      disabled={deleting === service.id}
                    >
                      {deleting === service.id ? "Deleting..." : "Delete"}
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
