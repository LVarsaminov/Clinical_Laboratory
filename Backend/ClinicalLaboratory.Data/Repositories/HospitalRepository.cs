using ClinicalLaboratory.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace ClinicalLaboratory.Data.Repositories
{
    public class HospitalRepository : Repository<Hospital>, IHospitalRepository
    {
        public HospitalRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<Hospital?> GetWithLaboratoriesAsync(int id)
        {
            return await _context.Hospitals
                .Include(h => h.Laboratories)
                .FirstOrDefaultAsync(h => h.Id == id);
        }
    }
}