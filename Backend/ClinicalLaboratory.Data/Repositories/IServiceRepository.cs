using ClinicalLaboratory.Data.Models;

namespace ClinicalLaboratory.Data.Repositories
{
    public interface IServiceRepository : IRepository<Service>
    {
        Task<IEnumerable<Service>> GetByNameAsync(string name);
    }
}