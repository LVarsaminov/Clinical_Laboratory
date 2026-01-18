using ClinicalLaboratory.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace ClinicalLaboratory.Data.Repositories
{
    public class LaboratoryRepository : Repository<Laboratory>, ILaboratoryRepository
    {
        public LaboratoryRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<Laboratory?> GetWithHospitalAsync(int id)
        {
            return await _context.Laboratories
                .Include(l => l.Hospital)
                .FirstOrDefaultAsync(l => l.Id == id);
        }

        public async Task<IEnumerable<Laboratory>> GetByHospitalIdAsync(int hospitalId)
        {
            return await _context.Laboratories
                .Include(l => l.Hospital)
                .Where(l => l.HospitalId == hospitalId)
                .ToListAsync();
        }
    }
}