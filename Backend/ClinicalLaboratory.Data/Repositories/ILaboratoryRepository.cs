using ClinicalLaboratory.Data.Models;

namespace ClinicalLaboratory.Data.Repositories
{
    public interface ILaboratoryRepository : IRepository<Laboratory>
    {
        Task<Laboratory?> GetWithHospitalAsync(int id);
        Task<IEnumerable<Laboratory>> GetByHospitalIdAsync(int hospitalId);
    }
}