import apiClient from "../apiClient";
import { AuthApi, EmployeesApi, HospitalsApi, LaboratoriesApi, PatientsApi, ServicesApi, TestsApi, ReportsApi } from "../api";

export const authApi = new AuthApi(undefined, undefined, apiClient);
export const employeesApi = new EmployeesApi(undefined, undefined, apiClient);
export const hospitalsApi = new HospitalsApi(undefined, undefined, apiClient);
export const laboratoriesApi = new LaboratoriesApi(undefined, undefined, apiClient);
export const patientsApi = new PatientsApi(undefined, undefined, apiClient);
export const servicesApi = new ServicesApi(undefined, undefined, apiClient);
export const testsApi = new TestsApi(undefined, undefined, apiClient);
export const reportsApi = new ReportsApi(undefined, undefined, apiClient);

// Export for access in window object
(window as any).api = {
  authApi,
  employeesApi,
  hospitalsApi,
  laboratoriesApi,
  patientsApi,
  servicesApi,
  testsApi,
  reportsApi,
};

