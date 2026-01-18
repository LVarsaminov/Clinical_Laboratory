using ClinicalLaboratory.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace ClinicalLaboratory.Data.Repositories
{
    public class PatientRepository : Repository<Patient>, IPatientRepository
    {
        public PatientRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<Patient?> GetByUserIdAsync(string userId)
        {
            return await _context.Patients
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.ApplicationUserId == userId);
        }

        public async Task<Patient?> GetByEGNAsync(string egn)
        {
            return await _context.Patients
                .FirstOrDefaultAsync(p => p.EGN == egn);
        }

        public async Task<IEnumerable<Patient>> SearchAsync(string searchTerm)
        {
            return await _context.Patients
                .Where(p => p.FullName.Contains(searchTerm) || p.EGN.Contains(searchTerm))
                .ToListAsync();
        }

        public async Task<Patient?> GetWithTestsAsync(int id)
        {
            return await _context.Patients
                .Include(p => p.Tests)
                .ThenInclude(t => t.Service)
                .Include(p => p.Tests)
                .ThenInclude(t => t.Employee)
                .FirstOrDefaultAsync(p => p.Id == id);
        }
    }
}