import React, { useState, useEffect } from "react";
import { testsApi, patientsApi, servicesApi, employeesApi } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import "../styles/TestsPage.css";

interface Test {
  id: number;
  patientId: number;
  serviceId: number;
  employeeId: number;
  testCode: string;
  sampleCollectionDate: string;
  resultDate?: string;
  date?: string
  status: string;
  result?: string;
  notes?: string;
  cost: number;
  isPaid: boolean;
  createdAt?: string;
}

interface Service {
  id: number;
  name: string;
}

interface Employee {
  id: number;
  fullName: string;
}

interface Patient {
  id: number;
  fullName: string;
}

export function PatientPortal() {
  const { userId } = useAuth();
  const [tests, setTests] = useState<Test[]>([]);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    fetchPatientData();
  }, [userId]);

  const fetchPatientData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all patients and find the one with matching userId
      const patientsRes = await patientsApi.apiPatientsGet();
      const allPatients = Array.isArray(patientsRes.data) ? patientsRes.data : [];
      const currentPatient = allPatients.find((p: any) => p.applicationUserId === userId);

      if (!currentPatient) {
        setError("Patient profile not found");
        setLoading(false);
        return;
      }

      setPatient(currentPatient);

      // Fetch patient's tests
      const testsRes = await testsApi.apiTestsMyTestsGet();
      const patientTests = Array.isArray(testsRes.data) ? testsRes.data : [];
      setTests(patientTests);

      // Fetch services and employees for reference
      const [servicesRes] = await Promise.all([
        servicesApi.apiServicesGet(),
      ]);

      setServices(Array.isArray(servicesRes.data) ? servicesRes.data : []);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to fetch data";
      setError(errorMsg);
      console.error("Error fetching patient data:", err);
    } finally {
      setLoading(false);
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
console.log(tests)

  return (
    <section className="page-section">
      <div className="page-header">
        <h2>My Medical Tests</h2>
        <p className="text-muted">View all your registered medical tests and results</p>
      </div>

      {patient && (
        <div className="patient-info" style={{ marginBottom: "20px", padding: "15px", backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
          <h3>Patient Information</h3>
          <p><strong>Name:</strong> {patient.fullName}</p>
          <p><strong>Total Tests:</strong> {tests.length}</p>
        </div>
      )}

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by test code or service name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="search-input"
          style={{ maxWidth: "150px" }}
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <span className="result-count">{tests.length} results</span>
      </div>

      {loading && <div className="loading">Loading your tests...</div>}

      {error && (
        <div className="alert alert-error" style={{ marginBottom: "20px" }}>
          {error}
        </div>
      )}

      {!loading && tests.length === 0 ? (
        <div className="no-data">No medical tests found</div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Test Code</th>
                <th>Service</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((test) => (
                <tr key={test.id}>
                  <td className="font-weight-bold">{test.id}</td>
                  <td>{services.find((s) => s.id === test.serviceId)?.name || "N/A"}</td>
                  <td>{test.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
