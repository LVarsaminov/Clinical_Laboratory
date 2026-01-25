import React, { useState, useEffect } from "react";
import { testsApi, patientsApi, servicesApi, employeesApi, laboratoriesApi } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import "../styles/TestsPage.css";

interface Test {
  id: number;
  patientId: number;
  serviceId: number;
  laboratoryId: number;
  employeeId: number;
  testCode: string;
  sampleCollectionDate: string;
  resultDate?: string;
  status: string;
  result?: string;
  notes?: string;
  cost: number;
  isPaid: boolean;
  createdAt?: string;
}

interface Patient {
  id: number;
  patientCode?: string;
  firstName?: string;
  lastName?: string;
}

interface Service {
  id: number;
  name: string;
}

interface Employee {
  id: number;
  firstName?: string;
  lastName?: string;
}

interface Laboratory {
  id: number;
  name: string;
}

export function TestsPage() {
  const { userRole, userId } = useAuth();
  const isPatient = userRole === "Patient";
  
  const [tests, setTests] = useState<Test[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [laboratories, setLaboratories] = useState<Laboratory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [currentPatientId, setCurrentPatientId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    patientId: "",
    serviceId: "",
    employeeId: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (isPatient) {
        // For patients, fetch their own tests
        const allPatients = await patientsApi.apiPatientsGet();
        const patientList = Array.isArray(allPatients.data) ? allPatients.data : [];
        const patient = patientList.find((p: any) => p.applicationUserId === userId);

        if (!patient) {
          setError("Patient profile not found");
          setLoading(false);
          return;
        }

        setCurrentPatientId(patient.id);

        // Fetch patient's tests using the patient-specific endpoint
        const testRes = await testsApi.apiTestsPatientPatientIdGet(patient.id);
        setTests(Array.isArray(testRes.data) ? testRes.data : []);

        // Fetch services and employees for reference
        const [servicesRes, employeesRes] = await Promise.all([
          servicesApi.apiServicesGet(),
          employeesApi.apiEmployeesGet(),
        ]);

        setServices(Array.isArray(servicesRes.data) ? servicesRes.data : []);
        setEmployees(Array.isArray(employeesRes.data) ? employeesRes.data : []);
      } else {
        // For admin/employees, fetch all tests with all related data
        const [testRes, patRes, srvRes, empRes, labRes] = await Promise.all([
          testsApi.apiTestsGet(),
          patientsApi.apiPatientsGet(),
          servicesApi.apiServicesGet(),
          employeesApi.apiEmployeesGet(),
          laboratoriesApi.apiLaboratoriesGet(),
        ]);
        setTests(Array.isArray(testRes.data) ? testRes.data : []);
        setPatients(Array.isArray(patRes.data) ? patRes.data : []);
        setServices(Array.isArray(srvRes.data) ? srvRes.data : []);
        setEmployees(Array.isArray(empRes.data) ? empRes.data : []);
        setLaboratories(Array.isArray(labRes.data) ? labRes.data : []);
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to fetch data";
      setError(errorMsg);
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
    if (!formData.patientId || !formData.serviceId || !formData.employeeId) {
      setError("All required fields must be filled");
      return;
    }

    try {
      setCreating(true);
      setError(null);
      await testsApi.apiTestsPost({
        patientId: parseInt(formData.patientId),
        serviceId: parseInt(formData.serviceId),
        employeeId: parseInt(formData.employeeId),
        date: formData.date,
      } as any);

      setFormData({
        patientId: "",
        serviceId: "",
        employeeId: "",
        date: new Date().toISOString().split("T")[0],
      });
      setShowForm(false);
      await fetchData();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to create test";
      setError(errorMsg);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this test?")) return;
    try {
      setDeleting(id);
      await testsApi.apiTestsIdDelete(id);
      await fetchData();
      setDeleting(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete test");
      setDeleting(null);
    }
  };

  const handleEditClick = (test: Test) => {
    setEditingId(test.id);
    setFormData({
      patientId: test.patientId.toString(),
      serviceId: test.serviceId.toString(),
      employeeId: test.employeeId.toString(),
      date: test.sampleCollectionDate || new Date().toISOString().split("T")[0],
    });
    setShowForm(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !formData.patientId || !formData.serviceId || !formData.employeeId) {
      setError("All fields required");
      return;
    }
    try {
      setCreating(true);
      await testsApi.apiTestsIdPut(editingId, {
        patientId: parseInt(formData.patientId),
        serviceId: parseInt(formData.serviceId),
        employeeId: parseInt(formData.employeeId),
        sampleCollectionDate: formData.date,
      } as any);
      await fetchData();
      setFormData({
        patientId: "",
        serviceId: "",
        employeeId: "",
        date: new Date().toISOString().split("T")[0],
      });
      setShowForm(false);
      setEditingId(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update test");
    } finally {
      setCreating(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "status-pending";
      case "in progress":
        return "status-progress";
      case "completed":
        return "status-completed";
      case "cancelled":
        return "status-cancelled";
      default:
        return "status-unknown";
    }
  };

  let filteredTests = tests.filter((t) => {
    const matchesSearch =
      t.testCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patients.find((p) => p.id === t.patientId)?.firstName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "All" || t.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <section className="page-section">
      <div className="page-header">
        <h2>Medical Tests Management</h2>
        {!isPatient && (
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "+ Register Test"}
          </button>
        )}
      </div>

      {showForm && !isPatient && (
        <div className="form-card">
          <h3>{editingId ? "Edit Medical Test" : "Register New Medical Test"}</h3>
          <form onSubmit={editingId ? handleUpdate : handleSubmit} className="test-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="patientId">Patient *</label>
                <select
                  id="patientId"
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleInputChange}
                  disabled={creating}
                  required
                >
                  <option value="">Select a patient</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.firstName} {p.lastName} ({p.patientCode})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="serviceId">Service/Test Type *</label>
                <select
                  id="serviceId"
                  name="serviceId"
                  value={formData.serviceId}
                  onChange={handleInputChange}
                  disabled={creating}
                  required
                >
                  <option value="">Select a service</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="employeeId">Registered By *</label>
                <select
                  id="employeeId"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleInputChange}
                  disabled={creating}
                  required
                >
                  <option value="">Select an employee</option>
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.firstName} {e.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="date">Test Date *</label>
                <input
                  id="date"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  disabled={creating}
                  required
                />
              </div>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-actions">
              <button type="submit" className="btn btn-success" disabled={creating}>
                {creating ? (editingId ? "Updating..." : "Registering...") : (editingId ? "Update Test" : "Register Test")}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({
                    patientId: "",
                    serviceId: "",
                    employeeId: "",
                    date: new Date().toISOString().split("T")[0],
                  });
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="filters-bar">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search tests by code or patient..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="result-count">{filteredTests.length} results</span>
        </div>

        {!isPatient && (
          <div className="filter-group">
            <label htmlFor="statusFilter">Filter by Status:</label>
            <select id="statusFilter" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option>All</option>
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
          </div>
        )}
      </div>

      {loading && <div className="loading">Loading tests...</div>}

      {!loading && filteredTests.length === 0 ? (
        <div className="no-data">No tests found</div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Test Code</th>
                <th>Patient</th>
                <th>Service</th>
                <th>Laboratory</th>
                <th>Collection Date</th>
                <th>Status</th>
                <th>Cost</th>
                <th>Paid</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTests.map((test) => (
                <tr key={test.id}>
                  <td>{test.id}</td>
                  <td className="font-weight-bold">{test.testCode}</td>
                  <td>
                    {isPatient
                      ? "N/A"
                      : `${patients.find((p) => p.id === test.patientId)?.firstName} ${patients.find((p) => p.id === test.patientId)?.lastName}`}
                  </td>
                  <td>{services.find((s) => s.id === test.serviceId)?.name || "N/A"}</td>
                  <td>{laboratories.find((l) => l.id === test.laboratoryId)?.name || "N/A"}</td>
                  <td>{new Date(test.sampleCollectionDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge ${getStatusBadgeClass(test.status)}`}>{test.status}</span>
                  </td>
                  <td>${test.cost.toFixed(2)}</td>
                  <td>{test.isPaid ? "✓ Yes" : "✗ No"}</td>
                  <td>
                    {!isPatient && (
                      <>
                        <button
                          className="btn btn-sm btn-info"
                          onClick={() => handleEditClick(test)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(test.id)}
                          disabled={deleting === test.id}
                        >
                          {deleting === test.id ? "Deleting..." : "Delete"}
                        </button>
                      </>
                    )}
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
