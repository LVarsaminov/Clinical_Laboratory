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
  date?: string;
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
  fullName?: string;
  applicationUserId?: number;
}

interface Service {
  id: number;
  name: string;
}

interface Employee {
  id: number;
  fullName?: string;
}

interface Laboratory {
  id: number;
  name: string;
}

export function TestsPage() {
  const { userRole, userId } = useAuth();
  const isPatient = userRole === "Patient";
  const isEmployee = userRole === "Employee" || userRole === "Admin";

  const [tests, setTests] = useState<Test[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [laboratories, setLaboratories] = useState<Laboratory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
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

      const parsedUserId = userId ? parseInt(userId) : null;

      if (isPatient && parsedUserId !== null) {
        // Patient: fetch their own tests
        const allPatients = await patientsApi.apiPatientsGet();
        const patientList = Array.isArray(allPatients.data) ? allPatients.data : [];
        const patient = patientList.find((p: Patient) => p.applicationUserId === parsedUserId);

        if (!patient) {
          setError("Patient profile not found");
          setLoading(false);
          return;
        }

        setCurrentPatientId(patient.id);

        const testRes = await testsApi.apiTestsMyTestsGet();
        setTests(Array.isArray(testRes.data) ? testRes.data : []);

        const [servicesRes, employeesRes] = await Promise.all([
          servicesApi.apiServicesGet(),
          employeesApi.apiEmployeesGet(),
        ]);

        setServices(Array.isArray(servicesRes.data) ? servicesRes.data : []);
        setEmployees(Array.isArray(employeesRes.data) ? employeesRes.data : []);
      } else if (isEmployee) {
        // Employee/Admin: fetch all tests
        const testRes = await testsApi.apiTestsGet();
        setTests(Array.isArray(testRes.data) ? testRes.data : []);

        const [srvRes, patRes, empRes, labRes] = await Promise.all([
          servicesApi.apiServicesGet(),
          patientsApi.apiPatientsGet(),
          employeesApi.apiEmployeesGet(),
          laboratoriesApi.apiLaboratoriesGet(),
        ]);

        setServices(Array.isArray(srvRes.data) ? srvRes.data : []);
        setPatients(Array.isArray(patRes.data) ? patRes.data : [])
        setEmployees(Array.isArray(empRes.data) ? empRes.data : []);
        setLaboratories(Array.isArray(labRes.data) ? labRes.data : []);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to fetch data");
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
      setError(err.response?.data?.message || err.message || "Failed to create test");
    } finally {
      setCreating(false);
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
      setError("All fields are required");
      return;
    }
    try {
      setCreating(true);
      await testsApi.apiTestsIdPut(editingId, {
        patientId: parseInt(formData.patientId),
        serviceId: parseInt(formData.serviceId),
        employeeId: parseInt(formData.employeeId),
        date: formData.date,
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

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this test?")) return;
    try {
      setCreating(true);
      await testsApi.apiTestsIdDelete(id);
      await fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete test");
    } finally {
      setCreating(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending": return "status-pending";
      case "in progress": return "status-progress";
      case "completed": return "status-completed";
      case "cancelled": return "status-cancelled";
      default: return "status-unknown";
    }
  };

  return (
    <section className="page-section">
      <div className="page-header">
        <h2>Medical Tests Management</h2>
      </div>

      {showForm && isEmployee && (
        <div className="form-card">
          <h3>{editingId ? "Edit Medical Test" : "Register New Medical Test"}</h3>
          <form onSubmit={editingId ? handleUpdate : handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="patientId">Patient *</label>
                <select name="patientId" value={formData.patientId} onChange={handleInputChange} required>
                  <option value="">Select a patient</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>({p.id}) {p.fullName}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="serviceId">Service *</label>
                <select name="serviceId" value={formData.serviceId} onChange={handleInputChange} required>
                  <option value="">Select a service</option>
                  {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="employeeId">Registered By *</label>
                <select name="employeeId" value={formData.employeeId} onChange={handleInputChange} required>
                  <option value="">Select an employee</option>
                  {employees.map(e => <option key={e.id} value={e.id}>({e.id}) {e.fullName}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="date">Test Date *</label>
                <input type="date" name="date" value={formData.date} onChange={handleInputChange} required />
              </div>
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <div className="form-actions">
              <button type="submit" className="btn btn-success">
                {editingId ? "Update Test" : "Register Test"}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading && <div className="loading">Loading tests...</div>}

      {!loading && tests.length === 0 && <div className="no-data">No tests found</div>}

      {!loading && tests.length > 0 && (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient ID</th>
                <th>Service</th>
                <th>Date</th>
                {isEmployee && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {tests.map(test => (
                <tr key={test.id}>
                  <td>{test.id}</td>
                  <td>{`${test.patientId || "N/A"}`}</td>
                  <td>{services.find(s => s.id === test.serviceId)?.name || "N/A"}</td>
                  <td>{test.date}</td>

                  {isEmployee && (
                    <td>
                      <button className="btn btn-sm btn-info" onClick={() => handleEditClick(test)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(test.id)}>Delete</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
