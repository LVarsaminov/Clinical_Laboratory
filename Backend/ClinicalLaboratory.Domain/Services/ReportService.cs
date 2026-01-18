using ClinicalLaboratory.Data.Models;
using ClinicalLaboratory.Data.Repositories;

namespace ClinicalLaboratory.Domain.Services
{
    public interface IReportService
    {
        Task<ReportData> GenerateLaboratoryReportAsync(int laboratoryId, DateTime startDate, DateTime endDate);
        Task<IEnumerable<Test>> GetEmployeeTestsReportAsync(int employeeId, DateTime? startDate, DateTime? endDate);
        Task<IEnumerable<Test>> GetPatientTestsReportAsync(int patientId);
        Task<FinancialReport> GenerateFinancialReportAsync(int laboratoryId, DateTime startDate, DateTime endDate);
    }

    public class ReportData
    {
        public int TotalTests { get; set; }
        public int TotalPatients { get; set; }
        public int TotalEmployees { get; set; }
        public decimal TotalRevenue { get; set; }
        public IEnumerable<Test> RecentTests { get; set; }
    }

    public class FinancialReport
    {
        public decimal TotalRevenue { get; set; }
        public decimal AverageTestPrice { get; set; }
        public Dictionary<string, decimal> RevenueByService { get; set; }
        public int TotalTests { get; set; }
    }

    public class ReportService : IReportService
    {
        private readonly ITestRepository _testRepository;
        private readonly IEmployeeRepository _employeeRepository;
        private readonly IPatientRepository _patientRepository;
        private readonly IServiceRepository _serviceRepository;

        public ReportService(
            ITestRepository testRepository,
            IEmployeeRepository employeeRepository,
            IPatientRepository patientRepository,
            IServiceRepository serviceRepository)
        {
            _testRepository = testRepository;
            _employeeRepository = employeeRepository;
            _patientRepository = patientRepository;
            _serviceRepository = serviceRepository;
        }

        public async Task<ReportData> GenerateLaboratoryReportAsync(int laboratoryId, DateTime startDate,
            DateTime endDate)
        {
            var employees = await _employeeRepository.GetByLaboratoryIdAsync(laboratoryId);
            var employeeIds = employees.Select(e => e.Id).ToList();

            var tests = await _testRepository.GetByDateRangeAsync(startDate, endDate);
            var laboratoryTests = tests.Where(t => employeeIds.Contains(t.EmployeeId)).ToList();

            var report = new ReportData
            {
                TotalTests = laboratoryTests.Count,
                TotalPatients = laboratoryTests.Select(t => t.PatientId).Distinct().Count(),
                TotalEmployees = employees.Count(),
                TotalRevenue = laboratoryTests.Sum(t => t.Service?.Price ?? 0),
                RecentTests = laboratoryTests.OrderByDescending(t => t.Date).Take(10)
            };

            return report;
        }

        public async Task<IEnumerable<Test>> GetEmployeeTestsReportAsync(int employeeId, DateTime? startDate,
            DateTime? endDate)
        {
            var tests = await _testRepository.GetByEmployeeIdAsync(employeeId);

            if (startDate.HasValue)
                tests = tests.Where(t => t.Date >= startDate.Value).ToList();

            if (endDate.HasValue)
                tests = tests.Where(t => t.Date <= endDate.Value).ToList();

            return tests.OrderByDescending(t => t.Date);
        }

        public async Task<IEnumerable<Test>> GetPatientTestsReportAsync(int patientId)
        {
            return await _testRepository.GetByPatientIdAsync(patientId);
        }

        public async Task<FinancialReport> GenerateFinancialReportAsync(int laboratoryId, DateTime startDate,
            DateTime endDate)
        {
            var employees = await _employeeRepository.GetByLaboratoryIdAsync(laboratoryId);
            var employeeIds = employees.Select(e => e.Id).ToList();

            var tests = await _testRepository.GetByDateRangeAsync(startDate, endDate);
            var laboratoryTests = tests.Where(t => employeeIds.Contains(t.EmployeeId)).ToList();

            var revenueByService = laboratoryTests
                .GroupBy(t => t.Service?.Name ?? "Unknown")
                .ToDictionary(g => g.Key, g => g.Sum(t => t.Service?.Price ?? 0));

            var report = new FinancialReport
            {
                TotalRevenue = laboratoryTests.Sum(t => t.Service?.Price ?? 0),
                AverageTestPrice = laboratoryTests.Any() ? laboratoryTests.Average(t => t.Service?.Price ?? 0) : 0,
                RevenueByService = revenueByService,
                TotalTests = laboratoryTests.Count
            };

            return report;
        }
    }
}