using ClinicalLaboratory.Data.Models;

namespace ClinicalLaboratory.Data.Repositories
{
    public interface IHospitalRepository : IRepository<Hospital>
    {
        Task<Hospital?> GetWithLaboratoriesAsync(int id);
    }
}