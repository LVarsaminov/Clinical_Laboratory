import React, { useState, useEffect } from "react";
import { reportsApi, laboratoriesApi, employeesApi, patientsApi } from "../services/api";
import "../styles/ReportsPage.css";

interface LaboratoryReport {
  laboratoryId: number;
  laboratoryName?: string;
  totalTests?: number;
  completedTests?: number;
  pendingTests?: number;
  revenue?: number;
  period?: string;
}

interface EmployeeReport {
  employeeId: number;
  employeeName?: string;
  totalTestsRegistered?: number;
  completedTests?: number;
  averageCompletionTime?: number;
  period?: string;
}

interface PatientReport {
  patientId: number;
  patientName?: string;
  totalTests?: number;
  completedTests?: number;
  lastTestDate?: string;
  medicalHistory?: string;
}

interface FinancialReport {
  laboratoryId: number;
  laboratoryName?: string;
  totalRevenue?: number;
  totalExpenses?: number;
  netProfit?: number;
  testCount?: number;
  averageTestCost?: number;
  period?: string;
}

interface Laboratory {
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

export function ReportsPage() {
  const [reportType, setReportType] = useState<"laboratory" | "employee" | "patient" | "financial">("laboratory");
  const [laboratoryReports, setLaboratoryReports] = useState<LaboratoryReport[]>([]);
  const [employeeReports, setEmployeeReports] = useState<EmployeeReport[]>([]);
  const [patientReports, setPatientReports] = useState<PatientReport[]>([]);
  const [financialReports, setFinancialReports] = useState<FinancialReport[]>([]);

  const [laboratories, setLaboratories] = useState<Laboratory[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [selectedLaboratory, setSelectedLaboratory] = useState<string>("");
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [startDate, setStartDate] = useState(getDefaultStartDate());
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);

  function getDefaultStartDate() {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split("T")[0];
  }

  useEffect(() => {
    fetchMetadata();
  }, []);

  useEffect(() => {
    fetchReports();
  }, [reportType, selectedLaboratory, selectedEmployee, selectedPatient, startDate, endDate]);

  const fetchMetadata = async () => {
    try {
      const [labRes, empRes, patRes] = await Promise.all([
        laboratoriesApi.apiLaboratoriesGet(),
        employeesApi.apiEmployeesGet(),
        patientsApi.apiPatientsGet(),
      ]);
      setLaboratories(Array.isArray(labRes.data) ? labRes.data : []);
      setEmployees(Array.isArray(empRes.data) ? empRes.data : []);
      setPatients(Array.isArray(patRes.data) ? patRes.data : []);
    } catch (err: any) {
      console.error("Failed to fetch metadata", err);
    }
  };

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);

      switch (reportType) {
        case "laboratory":
          if (selectedLaboratory) {
            const res: any = await reportsApi.apiReportsLaboratoryLaboratoryIdGet(
              parseInt(selectedLaboratory),
              startDate,
              endDate
            );
            setLaboratoryReports(Array.isArray(res.data) ? res.data as LaboratoryReport[] : res.data ? [res.data as LaboratoryReport] : []);
          } else {
            // Fetch all laboratory reports
            const labIds = laboratories.map((l) => l.id);
            const reports = await Promise.all(
              labIds.map((id) =>
                reportsApi
                  .apiReportsLaboratoryLaboratoryIdGet(id, startDate, endDate)
                  .then((r: any) => (Array.isArray(r.data) ? r.data : [r.data]))
                  .catch(() => [])
              )
            );
            setLaboratoryReports(reports.flat());
          }
          break;

        case "employee":
          if (selectedEmployee) {
            const res: any = await reportsApi.apiReportsEmployeeEmployeeIdGet(
              parseInt(selectedEmployee),
              startDate,
              endDate
            );
            setEmployeeReports(Array.isArray(res.data) ? res.data as EmployeeReport[] : res.data ? [res.data as EmployeeReport] : []);
          }
          break;

        case "patient":
          if (selectedPatient) {
            const res: any = await reportsApi.apiReportsPatientPatientIdGet(parseInt(selectedPatient));
            setPatientReports(Array.isArray(res.data) ? res.data as PatientReport[] : res.data ? [res.data as PatientReport] : []);
          }
          break;

        case "financial":
          if (selectedLaboratory) {
            const res: any = await reportsApi.apiReportsFinancialLaboratoryIdGet(
              parseInt(selectedLaboratory),
              startDate,
              endDate
            );
            setFinancialReports(Array.isArray(res.data) ? res.data as FinancialReport[] : res.data ? [res.data as FinancialReport] : []);
          } else {
            // Fetch all financial reports
            const labIds = laboratories.map((l) => l.id);
            const reports = await Promise.all(
              labIds.map((id) =>
                reportsApi
                  .apiReportsFinancialLaboratoryIdGet(id, startDate, endDate)
                  .then((r: any) => (Array.isArray(r.data) ? r.data : [r.data]))
                  .catch(() => [])
              )
            );
            setFinancialReports(reports.flat());
          }
          break;
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to fetch reports";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    let data: any[] = [];
    let filename = "report.csv";

    switch (reportType) {
      case "laboratory":
        data = laboratoryReports;
        filename = "laboratory-report.csv";
        break;
      case "employee":
        data = employeeReports;
        filename = "employee-report.csv";
        break;
      case "patient":
        data = patientReports;
        filename = "patient-report.csv";
        break;
      case "financial":
        data = financialReports;
        filename = "financial-report.csv";
        break;
    }

    if (data.length === 0) {
      alert("No data to export");
      return;
    }

    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(","),
      ...data.map((row) =>
        headers.map((header) => {
          const value = row[header];
          return typeof value === "string" && value.includes(",") ? `"${value}"` : value;
        }).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  };

  const calculateTotals = () => {
    switch (reportType) {
      case "laboratory":
        return {
          totalTests: laboratoryReports.reduce((sum, r) => sum + (r.totalTests || 0), 0),
          completedTests: laboratoryReports.reduce((sum, r) => sum + (r.completedTests || 0), 0),
          totalRevenue: laboratoryReports.reduce((sum, r) => sum + (r.revenue || 0), 0),
        };
      case "financial":
        return {
          totalRevenue: financialReports.reduce((sum, r) => sum + (r.totalRevenue || 0), 0),
          totalExpenses: financialReports.reduce((sum, r) => sum + (r.totalExpenses || 0), 0),
          netProfit: financialReports.reduce((sum, r) => sum + (r.netProfit || 0), 0),
        };
      default:
        return null;
    }
  };

  const totals = calculateTotals();

  return (
    <section className="page-section reports-section">
      <div className="page-header">
        <h2>Reports & Analytics</h2>
      </div>

      <div className="reports-controls">
        <div className="report-type-selector">
          <label>Report Type:</label>
          <select value={reportType} onChange={(e) => setReportType(e.target.value as any)}>
            <option value="laboratory">Laboratory Report</option>
            <option value="employee">Employee Report</option>
            <option value="patient">Patient Report</option>
            <option value="financial">Financial Report</option>
          </select>
        </div>

        {(reportType === "laboratory" || reportType === "financial") && (
          <div className="filter-group">
            <label>Laboratory:</label>
            <select value={selectedLaboratory} onChange={(e) => setSelectedLaboratory(e.target.value)}>
              <option value="">All Laboratories</option>
              {laboratories.map((lab) => (
                <option key={lab.id} value={lab.id}>
                  {lab.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {reportType === "employee" && (
          <div className="filter-group">
            <label>Employee:</label>
            <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)}>
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.fullName}
                </option>
              ))}
            </select>
          </div>
        )}

        {reportType === "patient" && (
          <div className="filter-group">
            <label>Patient:</label>
            <select value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)}>
              <option value="">Select Patient</option>
              {patients.map((pat) => (
                <option key={pat.id} value={pat.id}>
                  {pat.fullName}
                </option>
              ))}
            </select>
          </div>
        )}

        {reportType !== "patient" && (
          <>
            <div className="filter-group">
              <label>Start Date:</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>

            <div className="filter-group">
              <label>End Date:</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </>
        )}

        <button className="btn btn-success" onClick={exportToCSV}>
          📥 Export to CSV
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {loading && <div className="loading">Loading report...</div>}

      {!loading && (
        <>
          {/* Laboratory Report */}
          {reportType === "laboratory" && laboratoryReports.length > 0 && (
            <div className="report-container">
              <h3>Laboratory Performance Report</h3>
              {totals && (
                <div className="report-summary">
                  <div className="summary-card">
                    <h4>Total Tests</h4>
                    <p className="summary-value">{totals.totalTests}</p>
                  </div>
                  <div className="summary-card">
                    <h4>Completed Tests</h4>
                    <p className="summary-value">{totals.completedTests}</p>
                  </div>
                  <div className="summary-card">
                    <h4>Total Revenue</h4>
                    <p className="summary-value">${totals.totalRevenue?.toFixed(2)}</p>
                  </div>
                </div>
              )}
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Laboratory</th>
                      <th>Total Tests</th>
                      <th>Completed</th>
                      <th>Pending</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {laboratoryReports.map((report, idx) => (
                      <tr key={idx}>
                        <td className="font-weight-bold">{report.laboratoryName || `Lab ${report.laboratoryId}`}</td>
                        <td>{report.totalTests || 0}</td>
                        <td>{report.completedTests || 0}</td>
                        <td>{(report.totalTests || 0) - (report.completedTests || 0)}</td>
                        <td>${report.revenue?.toFixed(2) || "0.00"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Employee Report */}
          {reportType === "employee" && employeeReports.length > 0 && (
            <div className="report-container">
              <h3>Employee Performance Report</h3>
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Tests Registered</th>
                      <th>Completed</th>
                      <th>Avg. Completion Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employeeReports.map((report, idx) => (
                      <tr key={idx}>
                        <td className="font-weight-bold">{report.employeeName || `Employee ${report.employeeId}`}</td>
                        <td>{report.totalTestsRegistered || 0}</td>
                        <td>{report.completedTests || 0}</td>
                        <td>{report.averageCompletionTime ? `${report.averageCompletionTime}h` : "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Patient Report */}
          {reportType === "patient" && patientReports.length > 0 && (
            <div className="report-container">
              <h3>Patient Medical History Report</h3>
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Total Tests</th>
                      <th>Completed</th>
                      <th>Last Test Date</th>
                      <th>Medical Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patientReports.map((report, idx) => (
                      <tr key={idx}>
                        <td className="font-weight-bold">{report.patientName || `Patient ${report.patientId}`}</td>
                        <td>{report.totalTests || 0}</td>
                        <td>{report.completedTests || 0}</td>
                        <td>
                          {report.lastTestDate
                            ? new Date(report.lastTestDate).toLocaleDateString()
                            : "Never"}
                        </td>
                        <td>{report.medicalHistory || "No notes"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Financial Report */}
          {reportType === "financial" && financialReports.length > 0 && (
            <div className="report-container">
              <h3>Financial Report</h3>
              {totals && (
                <div className="report-summary">
                  <div className="summary-card">
                    <h4>Total Revenue</h4>
                    <p className="summary-value">${totals.totalRevenue?.toFixed(2)}</p>
                  </div>
                  <div className="summary-card">
                    <h4>Total Expenses</h4>
                    <p className="summary-value">${totals.totalExpenses?.toFixed(2)}</p>
                  </div>
                  <div className="summary-card" style={{ backgroundColor: totals.netProfit! > 0 ? "#27ae60" : "#e74c3c" }}>
                    <h4>Net Profit</h4>
                    <p className="summary-value">${totals.netProfit?.toFixed(2)}</p>
                  </div>
                </div>
              )}
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Laboratory</th>
                      <th>Revenue</th>
                      <th>Expenses</th>
                      <th>Net Profit</th>
                      <th>Test Count</th>
                      <th>Avg. Cost/Test</th>
                    </tr>
                  </thead>
                  <tbody>
                    {financialReports.map((report, idx) => (
                      <tr key={idx}>
                        <td className="font-weight-bold">{report.laboratoryName || `Lab ${report.laboratoryId}`}</td>
                        <td>${report.totalRevenue?.toFixed(2) || "0.00"}</td>
                        <td>${report.totalExpenses?.toFixed(2) || "0.00"}</td>
                        <td
                          style={{
                            color: (report.netProfit || 0) > 0 ? "#27ae60" : "#e74c3c",
                            fontWeight: "bold",
                          }}
                        >
                          ${report.netProfit?.toFixed(2) || "0.00"}
                        </td>
                        <td>{report.testCount || 0}</td>
                        <td>${report.averageTestCost?.toFixed(2) || "0.00"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* No Data Message */}
          {laboratoryReports.length === 0 &&
            employeeReports.length === 0 &&
            patientReports.length === 0 &&
            financialReports.length === 0 && (
              <div className="no-data">
                No reports available. Please select filters and try again.
              </div>
            )}
        </>
      )}
    </section>
  );
}
