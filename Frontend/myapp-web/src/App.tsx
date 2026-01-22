import React, { useEffect, useState } from "react";
import { authApi, employeesApi } from "./services/api";
import { Employee } from "./api";
import "./App.css";

type TabType = "dashboard" | "hospitals" | "laboratories" | "employees" | "patients" | "services" | "tests";

function App() {
  const [currentTab, setCurrentTab] = useState<TabType>("dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  
  // Login states
  const [email, setEmail] = useState("admin@lab.com");
  const [password, setPassword] = useState("Admin@123");
  const [error, setError] = useState<string | null>(null);

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoggingIn(true);
      setError(null);
      
      const res = await authApi.apiAuthLoginPost({
        email,
        password,
      });
      
      const loginData = res.data as any;
      if (loginData?.token) {
        localStorage.setItem("token", loginData.token);
        setIsLoggedIn(true);
        setError(null);
      } else {
        setError("No token received from server");
      }
    } catch (err: any) {
      let errorMessage = "Login failed";
      if (err.response?.status === 401) {
        errorMessage = "Invalid email or password";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else {
        errorMessage = err.message || "Login failed";
      }
      setError(errorMessage);
      setIsLoggedIn(false);
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setCurrentTab("dashboard");
  };

  return (
    <div className="App">
      {!isLoggedIn ? (
        <div className="login-section">
          <h1>Clinical Laboratory Management System</h1>
          <h2>Login Required</h2>
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                disabled={loggingIn}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                disabled={loggingIn}
              />
            </div>
            {error && <p className="error">{error}</p>}
            <button type="submit" disabled={loggingIn}>
              {loggingIn ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      ) : (
        <>
          <header className="header">
            <h1>Clinical Laboratory Management System</h1>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </header>

          <nav className="tab-navigation">
            <button
              className={`tab-btn ${currentTab === "dashboard" ? "active" : ""}`}
              onClick={() => setCurrentTab("dashboard")}
            >
              Dashboard
            </button>
            <button
              className={`tab-btn ${currentTab === "hospitals" ? "active" : ""}`}
              onClick={() => setCurrentTab("hospitals")}
            >
              Hospitals
            </button>
            <button
              className={`tab-btn ${currentTab === "laboratories" ? "active" : ""}`}
              onClick={() => setCurrentTab("laboratories")}
            >
              Laboratories
            </button>
            <button
              className={`tab-btn ${currentTab === "employees" ? "active" : ""}`}
              onClick={() => setCurrentTab("employees")}
            >
              Employees
            </button>
            <button
              className={`tab-btn ${currentTab === "patients" ? "active" : ""}`}
              onClick={() => setCurrentTab("patients")}
            >
              Patients
            </button>
            <button
              className={`tab-btn ${currentTab === "services" ? "active" : ""}`}
              onClick={() => setCurrentTab("services")}
            >
              Services
            </button>
            <button
              className={`tab-btn ${currentTab === "tests" ? "active" : ""}`}
              onClick={() => setCurrentTab("tests")}
            >
              Tests
            </button>
          </nav>

          <main className="content">
            {currentTab === "dashboard" && <DashboardTab />}
            {currentTab === "hospitals" && <HospitalsTab />}
            {currentTab === "laboratories" && <LaboratoriesTab />}
            {currentTab === "employees" && <EmployeesTab />}
            {currentTab === "patients" && <PatientsTab />}
            {currentTab === "services" && <ServicesTab />}
            {currentTab === "tests" && <TestsTab />}
          </main>
        </>
      )}
    </div>
  );
}

// Dashboard Tab
function DashboardTab() {
  return (
    <section className="tab-content">
      <h2>Welcome to Clinical Laboratory Management System</h2>
      <div className="dashboard-info">
        <p>Use the navigation tabs above to manage:</p>
        <ul>
          <li><strong>Hospitals</strong> - Create and manage hospital information</li>
          <li><strong>Laboratories</strong> - Create and manage laboratory facilities</li>
          <li><strong>Employees</strong> - Register and manage laboratory staff</li>
          <li><strong>Patients</strong> - Register and manage patient information</li>
          <li><strong>Services</strong> - Create and manage laboratory services/tests</li>
          <li><strong>Tests</strong> - Register and track patient tests</li>
        </ul>
      </div>
    </section>
  );
}

// Hospitals Tab
function HospitalsTab() {
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      console.log("Fetching hospitals...");
      const token = localStorage.getItem("token");
      console.log("Token available:", !!token);
      if (token) {
        console.log("Token preview:", token.substring(0, 20) + "...");
      }
      const res = await (window as any).api.hospitalsApi.apiHospitalsGet();
      console.log("Hospitals response:", res);
      setHospitals(Array.isArray(res.data) ? res.data : []);
      console.log("Hospitals set to:", Array.isArray(res.data) ? res.data : []);
    } catch (err: any) {
      console.error("Error fetching hospitals - Full error:", err);
      console.error("Status:", err.response?.status);
      console.error("Status text:", err.response?.statusText);
      console.error("Response data:", err.response?.data);
      const errorMsg = `Failed to fetch hospitals: ${err.response?.statusText || err.message}`;
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter hospital name");
      return;
    }

    try {
      setCreating(true);
      setError(null);
      console.log("Creating hospital:", { name: name.trim(), address: address.trim() });
      const res = await (window as any).api.hospitalsApi.apiHospitalsPost({
        name: name.trim(),
        address: address.trim(),
      });
      console.log("Hospital creation response:", res);
      setName("");
      setAddress("");
      console.log("Fetching hospitals after creation...");
      await fetchHospitals();
      console.log("Hospital created and list refreshed");
    } catch (err: any) {
      console.error("Error creating hospital:", err);
      let errorMessage = "Failed to create hospital";
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data) {
        errorMessage = JSON.stringify(err.response.data);
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setCreating(false);
    }
  };

  return (
    <section className="tab-content">
      <h2>Hospitals Management</h2>
      <form onSubmit={handleCreate} className="create-form">
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter hospital name"
            disabled={creating}
          />
        </div>
        <div className="form-group">
          <label>Address:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter address"
            disabled={creating}
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={creating}>
          {creating ? "Creating..." : "Create Hospital"}
        </button>
      </form>

      <h3>Hospitals List ({hospitals.length})</h3>
      {loading ? (
        <p>Loading...</p>
      ) : hospitals.length === 0 ? (
        <p className="no-data">No hospitals found</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {hospitals.map((hospital) => (
              <tr key={hospital.id}>
                <td>{hospital.id}</td>
                <td>{hospital.name || "N/A"}</td>
                <td>{hospital.address || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

// Laboratories Tab
function LaboratoriesTab() {
  const [laboratories, setLaboratories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [hospitalId, setHospitalId] = useState<number | string>("");
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log("Fetching laboratories and hospitals...");
      const [labRes, hospRes] = await Promise.all([
        (window as any).api.laboratoriesApi.apiLaboratoriesGet(),
        (window as any).api.hospitalsApi.apiHospitalsGet(),
      ]);
      console.log("Laboratories response:", labRes);
      console.log("Hospitals response:", hospRes);
      setLaboratories(Array.isArray(labRes.data) ? labRes.data : []);
      setHospitals(Array.isArray(hospRes.data) ? hospRes.data : []);
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(`Failed to fetch data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter laboratory name");
      return;
    }
    if (!hospitalId) {
      setError("Please select a hospital");
      return;
    }

    try {
      setCreating(true);
      setError(null);
      console.log("Creating laboratory:", { name: name.trim(), hospitalId: parseInt(hospitalId.toString()) });
      const res = await (window as any).api.laboratoriesApi.apiLaboratoriesPost({
        name: name.trim(),
        hospitalId: parseInt(hospitalId.toString()),
      });
      console.log("Laboratory creation response:", res);
      setName("");
      setHospitalId("");
      await fetchData();
    } catch (err: any) {
      console.error("Error creating laboratory:", err);
      let errorMessage = "Failed to create laboratory";
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data) {
        errorMessage = JSON.stringify(err.response.data);
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setCreating(false);
    }
  };

  return (
    <section className="tab-content">
      <h2>Laboratories Management</h2>
      <form onSubmit={handleCreate} className="create-form">
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter laboratory name"
            disabled={creating}
          />
        </div>
        <div className="form-group">
          <label>Hospital:</label>
          <select
            value={hospitalId}
            onChange={(e) => setHospitalId(e.target.value)}
            disabled={creating}
          >
            <option value="">Select a hospital</option>
            {hospitals.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={creating}>
          {creating ? "Creating..." : "Create Laboratory"}
        </button>
      </form>

      <h3>Laboratories List ({laboratories.length})</h3>
      {loading ? (
        <p>Loading...</p>
      ) : laboratories.length === 0 ? (
        <p className="no-data">No laboratories found</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Hospital</th>
            </tr>
          </thead>
          <tbody>
            {laboratories.map((lab) => (
              <tr key={lab.id}>
                <td>{lab.id}</td>
                <td>{lab.name || "N/A"}</td>
                <td>{lab.hospital?.name || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

// Employees Tab (simplified version)
function EmployeesTab() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [employeePassword, setEmployeePassword] = useState("Employee@123");
  const [laboratoryId, setLaboratoryId] = useState<number | string>("");
  const [laboratories, setLaboratories] = useState<any[]>([]);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [empRes, labRes] = await Promise.all([
        (window as any).api.employeesApi.apiEmployeesGet(),
        (window as any).api.laboratoriesApi.apiLaboratoriesGet(),
      ]);
      setEmployees(Array.isArray(empRes.data) ? empRes.data : []);
      setLaboratories(Array.isArray(labRes.data) ? labRes.data : []);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError("Please enter employee name");
      return;
    }
    if (!employeeEmail.trim()) {
      setError("Please enter employee email");
      return;
    }
    if (!laboratoryId) {
      setError("Please select a laboratory");
      return;
    }

    try {
      setCreating(true);
      setError(null);
      const registerRes = await (window as any).api.authApi.apiAuthRegisterPost({
        email: employeeEmail.trim(),
        password: employeePassword,
        fullName: fullName.trim(),
        role: "Employee",
      });
      const userId = (registerRes.data as any)?.userId;
      if (!userId) throw new Error("Failed to get user ID");

      await (window as any).api.employeesApi.apiEmployeesPost({
        fullName: fullName.trim(),
        applicationUserId: userId,
        laboratoryId: parseInt(laboratoryId.toString()),
        registeredTests: [],
      });

      setFullName("");
      setEmployeeEmail("");
      setLaboratoryId("");
      await fetchData();
    } catch (err: any) {
      let errorMessage = "Failed to create employee";
      if (err.message.includes("FOREIGN KEY")) {
        errorMessage = "Laboratory not found!";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      setError(errorMessage);
    } finally {
      setCreating(false);
    }
  };

  return (
    <section className="tab-content">
      <h2>Employees Management</h2>
      <form onSubmit={handleCreate} className="create-form">
        <div className="form-group">
          <label>Full Name:</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter employee name"
            disabled={creating}
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={employeeEmail}
            onChange={(e) => setEmployeeEmail(e.target.value)}
            placeholder="Enter employee email"
            disabled={creating}
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={employeePassword}
            onChange={(e) => setEmployeePassword(e.target.value)}
            disabled={creating}
          />
        </div>
        <div className="form-group">
          <label>Laboratory:</label>
          <select
            value={laboratoryId}
            onChange={(e) => setLaboratoryId(e.target.value)}
            disabled={creating}
          >
            <option value="">Select a laboratory</option>
            {laboratories.map((lab) => (
              <option key={lab.id} value={lab.id}>
                {lab.name}
              </option>
            ))}
          </select>
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={creating}>
          {creating ? "Creating..." : "Create Employee"}
        </button>
      </form>

      <h3>Employees List ({employees.length})</h3>
      {loading ? (
        <p>Loading...</p>
      ) : employees.length === 0 ? (
        <p className="no-data">No employees found</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Laboratory</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.id}</td>
                <td>{emp.fullName || "N/A"}</td>
                <td>{emp.laboratory?.name || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

// Patients Tab
function PatientsTab() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("Patient@123");
  const [egn, setEgn] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      console.log("Fetching patients...");
      const res = await (window as any).api.patientsApi.apiPatientsGet();
      console.log("Patients response:", res);
      setPatients(Array.isArray(res.data) ? res.data : []);
    } catch (err: any) {
      console.error("Error fetching patients:", err);
      setError(`Failed to fetch patients: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError("Please enter patient name");
      return;
    }
    if (!email.trim()) {
      setError("Please enter email");
      return;
    }
    if (!egn.trim()) {
      setError("Please enter EGN");
      return;
    }

    try {
      setCreating(true);
      setError(null);
      console.log("Registering patient:", { fullName, email, egn });
      const registerRes = await (window as any).api.authApi.apiAuthRegisterPost({
        email: email.trim(),
        password,
        fullName: fullName.trim(),
        egn: egn.trim(),
        role: "Patient",
      });
      console.log("Patient registration response:", registerRes);
      await fetchPatients();
      setFullName("");
      setEmail("");
      setEgn("");
    } catch (err: any) {
      console.error("Error creating patient:", err);
      let errorMessage = "Failed to create patient";
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data) {
        errorMessage = JSON.stringify(err.response.data);
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setCreating(false);
    }
  };

  return (
    <section className="tab-content">
      <h2>Patients Management</h2>
      <form onSubmit={handleCreate} className="create-form">
        <div className="form-group">
          <label>Full Name:</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter patient name"
            disabled={creating}
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            disabled={creating}
          />
        </div>
        <div className="form-group">
          <label>EGN (Personal ID):</label>
          <input
            type="text"
            value={egn}
            onChange={(e) => setEgn(e.target.value)}
            placeholder="Enter EGN"
            disabled={creating}
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={creating}>
          {creating ? "Creating..." : "Create Patient"}
        </button>
      </form>

      <h3>Patients List ({patients.length})</h3>
      {loading ? (
        <p>Loading...</p>
      ) : patients.length === 0 ? (
        <p className="no-data">No patients found</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>EGN</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.id}</td>
                <td>{patient.fullName || "N/A"}</td>
                <td>{patient.egn || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

// Services Tab
function ServicesTab() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | string>("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      console.log("Fetching services...");
      const res = await (window as any).api.servicesApi.apiServicesGet();
      console.log("Services response:", res);
      setServices(Array.isArray(res.data) ? res.data : []);
    } catch (err: any) {
      console.error("Error fetching services:", err);
      setError(`Failed to fetch services: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter service name");
      return;
    }
    if (!price) {
      setError("Please enter price");
      return;
    }

    try {
      setCreating(true);
      setError(null);
      console.log("Creating service:", { name: name.trim(), price: parseFloat(price.toString()) });
      const res = await (window as any).api.servicesApi.apiServicesPost({
        name: name.trim(),
        price: parseFloat(price.toString()),
      });
      console.log("Service creation response:", res);
      setName("");
      setPrice("");
      await fetchServices();
    } catch (err: any) {
      console.error("Error creating service:", err);
      let errorMessage = "Failed to create service";
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data) {
        errorMessage = JSON.stringify(err.response.data);
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setCreating(false);
    }
  };

  return (
    <section className="tab-content">
      <h2>Services Management</h2>
      <form onSubmit={handleCreate} className="create-form">
        <div className="form-group">
          <label>Service Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter service name"
            disabled={creating}
          />
        </div>
        <div className="form-group">
          <label>Price:</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price"
            disabled={creating}
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={creating}>
          {creating ? "Creating..." : "Create Service"}
        </button>
      </form>

      <h3>Services List ({services.length})</h3>
      {loading ? (
        <p>Loading...</p>
      ) : services.length === 0 ? (
        <p className="no-data">No services found</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id}>
                <td>{service.id}</td>
                <td>{service.name || "N/A"}</td>
                <td>${service.price || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

// Tests Tab
function TestsTab() {
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [patientId, setPatientId] = useState<number | string>("");
  const [serviceId, setServiceId] = useState<number | string>("");
  const [employeeId, setEmployeeId] = useState<number | string>("");
  const [patients, setPatients] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log("Fetching tests data...");
      const [testRes, patRes, servRes, empRes] = await Promise.all([
        (window as any).api.testsApi.apiTestsGet(),
        (window as any).api.patientsApi.apiPatientsGet(),
        (window as any).api.servicesApi.apiServicesGet(),
        (window as any).api.employeesApi.apiEmployeesGet(),
      ]);
      console.log("Tests response:", testRes);
      console.log("Patients response:", patRes);
      console.log("Services response:", servRes);
      console.log("Employees response:", empRes);
      setTests(Array.isArray(testRes.data) ? testRes.data : []);
      setPatients(Array.isArray(patRes.data) ? patRes.data : []);
      setServices(Array.isArray(servRes.data) ? servRes.data : []);
      setEmployees(Array.isArray(empRes.data) ? empRes.data : []);
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(`Failed to fetch data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId) {
      setError("Please select a patient");
      return;
    }
    if (!serviceId) {
      setError("Please select a service");
      return;
    }
    if (!employeeId) {
      setError("Please select an employee");
      return;
    }

    try {
      setCreating(true);
      setError(null);
      console.log("Creating test:", { patientId: parseInt(patientId.toString()), serviceId: parseInt(serviceId.toString()), employeeId: parseInt(employeeId.toString()) });
      const res = await (window as any).api.testsApi.apiTestsPost({
        patientId: parseInt(patientId.toString()),
        serviceId: parseInt(serviceId.toString()),
        employeeId: parseInt(employeeId.toString()),
        date: new Date().toISOString(),
      });
      console.log("Test creation response:", res);
      setPatientId("");
      setServiceId("");
      setEmployeeId("");
      await fetchData();
    } catch (err: any) {
      console.error("Error creating test:", err);
      let errorMessage = "Failed to create test";
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data) {
        errorMessage = JSON.stringify(err.response.data);
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setCreating(false);
    }
  };

  return (
    <section className="tab-content">
      <h2>Tests Management</h2>
      <form onSubmit={handleCreate} className="create-form">
        <div className="form-group">
          <label>Patient:</label>
          <select
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            disabled={creating}
          >
            <option value="">Select a patient</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.fullName}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Service:</label>
          <select
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            disabled={creating}
          >
            <option value="">Select a service</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} (${s.price})
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Employee:</label>
          <select
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            disabled={creating}
          >
            <option value="">Select an employee</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.fullName}
              </option>
            ))}
          </select>
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={creating}>
          {creating ? "Creating..." : "Create Test"}
        </button>
      </form>

      <h3>Tests List ({tests.length})</h3>
      {loading ? (
        <p>Loading...</p>
      ) : tests.length === 0 ? (
        <p className="no-data">No tests found</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient</th>
              <th>Service</th>
              <th>Employee</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {tests.map((test) => (
              <tr key={test.id}>
                <td>{test.id}</td>
                <td>{test.patient?.fullName || "N/A"}</td>
                <td>{test.service?.name || "N/A"}</td>
                <td>{test.employee?.fullName || "N/A"}</td>
                <td>{new Date(test.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

// Helpers - just exporting App at the bottom

export default App;
