using ClinicalLaboratory.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace ClinicalLaboratory.Data.Repositories
{
    public class EmployeeRepository : Repository<Employee>, IEmployeeRepository
    {
        public EmployeeRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<Employee?> GetByUserIdAsync(string userId)
        {
            return await _context.Employees
                .Include(e => e.User)
                .Include(e => e.Laboratory)
                .FirstOrDefaultAsync(e => e.ApplicationUserId == userId);
        }

        public async Task<IEnumerable<Employee>> GetByLaboratoryIdAsync(int laboratoryId)
        {
            return await _context.Employees
                .Include(e => e.User)
                .Where(e => e.LaboratoryId == laboratoryId)
                .ToListAsync();
        }

        public async Task<Employee?> GetWithDetailsAsync(int id)
        {
            return await _context.Employees
                .Include(e => e.User)
                .Include(e => e.Laboratory)
                .ThenInclude(l => l.Hospital)
                .FirstOrDefaultAsync(e => e.Id == id);
        }
    }
}