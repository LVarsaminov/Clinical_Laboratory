import React from "react";
import { LoginPage } from "./components/LoginPage";
import { Dashboard } from "./components/Dashboard";
import { HospitalsPage } from "./components/HospitalsPage";
import { LaboratoriesPage } from "./components/LaboratoriesPage";
import { EmployeesPage } from "./components/EmployeesPage";
import { PatientsPage } from "./components/PatientsPage";
import { ServicesPage } from "./components/ServicesPage";
import { TestsPage } from "./components/TestsPage";
import { ReportsPage } from "./components/ReportsPage";
import { PatientPortal } from "./components/PatientPortal";
import { useAuth } from "./contexts/AuthContext";
import "./App.css";
import "./styles/LoginPage.css";
import "./styles/Dashboard.css";
import "./styles/HospitalsPage.css";
import "./styles/ReportsPage.css";

type TabType = "dashboard" | "hospitals" | "laboratories" | "employees" | "patients" | "services" | "tests" | "reports" | "my-tests";

function App() {
  const { isLoggedIn, logout, userRole } = useAuth();
  const [currentTab, setCurrentTab] = React.useState<TabType>("dashboard");

  const handleLogout = () => {
    logout();
    setCurrentTab("dashboard");
  };

  // Determine if user is patient
  const isPatient = userRole === "Patient";
  const isEmployee = userRole === "Employee";
  const isAdmin = userRole === "Admin";

  // Navigation items for admin/employee
  const adminNavItems = [
    { id: "dashboard", label: "Dashboard", show: true },
    { id: "hospitals", label: "Hospitals", show: isAdmin },
    { id: "laboratories", label: "Laboratories", show: isAdmin },
    { id: "employees", label: "Employees", show: isAdmin },
    { id: "patients", label: "Patients", show: isAdmin || isEmployee },
    { id: "services", label: "Services", show: isAdmin || isEmployee },
    { id: "tests", label: "Tests", show: isAdmin || isEmployee },
    { id: "reports", label: "Reports", show: isAdmin || isEmployee },
  ];

  // Navigation items for patients
  const patientNavItems = [
    { id: "dashboard", label: "Dashboard", show: true },
    { id: "my-tests", label: "My Tests", show: true },
  ];

  const navItems = isPatient ? patientNavItems : adminNavItems;

  return (
    <div className="App">
      {!isLoggedIn ? (
        <LoginPage onLoginSuccess={() => {}} />
      ) : (
        <>
          <header className="header">
            <h1>Clinical Laboratory Management System</h1>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <span style={{ fontSize: "0.9em", color: "#666" }}>Role: <strong>{userRole}</strong></span>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
          </header>

          <nav className="tab-navigation">
            {navItems.map(
              (item) =>
                item.show && (
                  <button
                    key={item.id}
                    className={`tab-btn ${currentTab === item.id ? "active" : ""}`}
                    onClick={() => setCurrentTab(item.id as TabType)}
                  >
                    {item.label}
                  </button>
                )
            )}
          </nav>

          <main className="content">
            {currentTab === "dashboard" && <Dashboard />}
            {currentTab === "my-tests" && <PatientPortal />}
            {currentTab === "hospitals" && <HospitalsPage />}
            {currentTab === "laboratories" && <LaboratoriesPage />}
            {currentTab === "employees" && <EmployeesPage />}
            {currentTab === "patients" && <PatientsPage />}
            {currentTab === "services" && <ServicesPage />}
            {currentTab === "tests" && <TestsPage />}
            {currentTab === "reports" && <ReportsPage />}
          </main>
        </>
      )}
    </div>
  );
}

export default App;
