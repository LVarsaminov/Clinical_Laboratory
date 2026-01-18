using ClinicalLaboratory.Data.Models;
using ClinicalLaboratory.Data.Repositories;

namespace ClinicalLaboratory.Domain.Services
{
    public interface IEmployeeService
    {
        Task<IEnumerable<Employee>> GetAllEmployeesAsync();
        Task<Employee?> GetEmployeeByIdAsync(int id);
        Task<Employee?> GetEmployeeByUserIdAsync(string userId);
        Task<IEnumerable<Employee>> GetEmployeesByLaboratoryIdAsync(int laboratoryId);
        Task<Employee> CreateEmployeeAsync(Employee employee);
        Task UpdateEmployeeAsync(Employee employee);
        Task DeleteEmployeeAsync(int id);
    }

    public class EmployeeService : IEmployeeService
    {
        private readonly IEmployeeRepository _employeeRepository;

        public EmployeeService(IEmployeeRepository employeeRepository)
        {
            _employeeRepository = employeeRepository;
        }

        public async Task<IEnumerable<Employee>> GetAllEmployeesAsync()
        {
            return await _employeeRepository.GetAllAsync();
        }

        public async Task<Employee?> GetEmployeeByIdAsync(int id)
        {
            return await _employeeRepository.GetWithDetailsAsync(id);
        }

        public async Task<Employee?> GetEmployeeByUserIdAsync(string userId)
        {
            return await _employeeRepository.GetByUserIdAsync(userId);
        }

        public async Task<IEnumerable<Employee>> GetEmployeesByLaboratoryIdAsync(int laboratoryId)
        {
            return await _employeeRepository.GetByLaboratoryIdAsync(laboratoryId);
        }

        public async Task<Employee> CreateEmployeeAsync(Employee employee)
        {
            if (string.IsNullOrEmpty(employee.FullName))
                throw new ArgumentException("Employee full name is required");

            if (employee.LaboratoryId <= 0)
                throw new ArgumentException("Valid Laboratory ID is required");

            return await _employeeRepository.AddAsync(employee);
        }

        public async Task UpdateEmployeeAsync(Employee employee)
        {
            var existingEmployee = await _employeeRepository.GetByIdAsync(employee.Id);
            if (existingEmployee == null)
                throw new KeyNotFoundException($"Employee with ID {employee.Id} not found");

            await _employeeRepository.UpdateAsync(employee);
        }

        public async Task DeleteEmployeeAsync(int id)
        {
            var employee = await _employeeRepository.GetByIdAsync(id);
            if (employee == null)
                throw new KeyNotFoundException($"Employee with ID {id} not found");

            await _employeeRepository.DeleteAsync(employee);
        }
    }
}