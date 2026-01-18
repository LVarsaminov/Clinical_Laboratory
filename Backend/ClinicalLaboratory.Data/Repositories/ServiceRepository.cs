using ClinicalLaboratory.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace ClinicalLaboratory.Data.Repositories
{
    public class ServiceRepository : Repository<Service>, IServiceRepository
    {
        public ServiceRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Service>> GetByNameAsync(string name)
        {
            return await _context.Services
                .Where(s => s.Name.Contains(name))
                .ToListAsync();
        }
    }
}