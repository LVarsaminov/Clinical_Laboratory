using ClinicalLaboratory.Data.Models;

namespace ClinicalLaboratory.Data.Repositories
{
    public interface IEmployeeRepository : IRepository<Employee>
    {
        Task<Employee?> GetByUserIdAsync(string userId);
        Task<IEnumerable<Employee>> GetByLaboratoryIdAsync(int laboratoryId);
        Task<Employee?> GetWithDetailsAsync(int id);
    }
}