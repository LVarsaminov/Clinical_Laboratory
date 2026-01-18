using ClinicalLaboratory.Data.Models;

namespace ClinicalLaboratory.Data.Repositories
{
    public interface ITestRepository : IRepository<Test>
    {
        Task<IEnumerable<Test>> GetByPatientIdAsync(int patientId);
        Task<IEnumerable<Test>> GetByEmployeeIdAsync(int employeeId);
        Task<IEnumerable<Test>> GetByDateRangeAsync(DateTime startDate, DateTime endDate);
        Task<IEnumerable<Test>> GetWithDetailsAsync();
        Task<Test?> GetWithDetailsByIdAsync(int id);
    }
}