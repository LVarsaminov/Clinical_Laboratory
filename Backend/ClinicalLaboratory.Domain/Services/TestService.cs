using ClinicalLaboratory.Data.Models;
using ClinicalLaboratory.Data.Repositories;

namespace ClinicalLaboratory.Domain.Services
{
    public interface ITestService
    {
        Task<IEnumerable<Test>> GetAllTestsAsync();
        Task<Test?> GetTestByIdAsync(int id);
        Task<IEnumerable<Test>> GetTestsByPatientIdAsync(int patientId);
        Task<IEnumerable<Test>> GetTestsByEmployeeIdAsync(int employeeId);
        Task<IEnumerable<Test>> GetTestsByDateRangeAsync(DateTime startDate, DateTime endDate);
        Task<Test> CreateTestAsync(Test test);
        Task UpdateTestAsync(Test test);
        Task DeleteTestAsync(int id);
        Task<IEnumerable<Test>> GetPatientTestsAsync(string userId);
        Task<IEnumerable<Test>> GetEmployeeTestsAsync(string userId);
    }

    public class TestService : ITestService
    {
        private readonly ITestRepository _testRepository;
        private readonly IPatientRepository _patientRepository;
        private readonly IEmployeeRepository _employeeRepository;
        private readonly IServiceRepository _serviceRepository;

        public TestService(
            ITestRepository testRepository,
            IPatientRepository patientRepository,
            IEmployeeRepository employeeRepository,
            IServiceRepository serviceRepository)
        {
            _testRepository = testRepository;
            _patientRepository = patientRepository;
            _employeeRepository = employeeRepository;
            _serviceRepository = serviceRepository;
        }

        public async Task<IEnumerable<Test>> GetAllTestsAsync()
        {
            return await _testRepository.GetWithDetailsAsync();
        }

        public async Task<Test?> GetTestByIdAsync(int id)
        {
            return await _testRepository.GetWithDetailsByIdAsync(id);
        }

        public async Task<IEnumerable<Test>> GetTestsByPatientIdAsync(int patientId)
        {
            return await _testRepository.GetByPatientIdAsync(patientId);
        }

        public async Task<IEnumerable<Test>> GetTestsByEmployeeIdAsync(int employeeId)
        {
            return await _testRepository.GetByEmployeeIdAsync(employeeId);
        }

        public async Task<IEnumerable<Test>> GetTestsByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return await _testRepository.GetByDateRangeAsync(startDate, endDate);
        }

        public async Task<Test> CreateTestAsync(Test test)
        {
            // Validate test data
            if (test.PatientId <= 0)
                throw new ArgumentException("Valid Patient ID is required");

            if (test.ServiceId <= 0)
                throw new ArgumentException("Valid Service ID is required");

            if (test.EmployeeId <= 0)
                throw new ArgumentException("Valid Employee ID is required");

            // Verify patient exists
            var patient = await _patientRepository.GetByIdAsync(test.PatientId);
            if (patient == null)
                throw new KeyNotFoundException($"Patient with ID {test.PatientId} not found");

            // Verify service exists
            var service = await _serviceRepository.GetByIdAsync(test.ServiceId);
            if (service == null)
                throw new KeyNotFoundException($"Service with ID {test.ServiceId} not found");

            // Verify employee exists
            var employee = await _employeeRepository.GetByIdAsync(test.EmployeeId);
            if (employee == null)
                throw new KeyNotFoundException($"Employee with ID {test.EmployeeId} not found");

            // Set current date if not provided
            if (test.Date == default)
                test.Date = DateTime.UtcNow;

            return await _testRepository.AddAsync(test);
        }

        public async Task UpdateTestAsync(Test test)
        {
            var existingTest = await _testRepository.GetByIdAsync(test.Id);
            if (existingTest == null)
                throw new KeyNotFoundException($"Test with ID {test.Id} not found");

            await _testRepository.UpdateAsync(test);
        }

        public async Task DeleteTestAsync(int id)
        {
            var test = await _testRepository.GetByIdAsync(id);
            if (test == null)
                throw new KeyNotFoundException($"Test with ID {id} not found");

            await _testRepository.DeleteAsync(test);
        }

        public async Task<IEnumerable<Test>> GetPatientTestsAsync(string userId)
        {
            var patient = await _patientRepository.GetByUserIdAsync(userId);
            if (patient == null)
                return Enumerable.Empty<Test>();

            return await _testRepository.GetByPatientIdAsync(patient.Id);
        }

        public async Task<IEnumerable<Test>> GetEmployeeTestsAsync(string userId)
        {
            var employee = await _employeeRepository.GetByUserIdAsync(userId);
            if (employee == null)
                return Enumerable.Empty<Test>();

            return await _testRepository.GetByEmployeeIdAsync(employee.Id);
        }
    }
}