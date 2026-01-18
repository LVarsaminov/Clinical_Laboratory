using ClinicalLaboratory.Data.Models;

namespace ClinicalLaboratory.Data.Repositories
{
    public interface IPatientRepository : IRepository<Patient>
    {
        Task<Patient?> GetByUserIdAsync(string userId);
        Task<Patient?> GetByEGNAsync(string egn);
        Task<IEnumerable<Patient>> SearchAsync(string searchTerm);
        Task<Patient?> GetWithTestsAsync(int id);
    }
}