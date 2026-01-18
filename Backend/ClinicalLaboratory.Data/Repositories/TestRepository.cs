using ClinicalLaboratory.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace ClinicalLaboratory.Data.Repositories
{
    public class TestRepository : Repository<Test>, ITestRepository
    {
        public TestRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Test>> GetByPatientIdAsync(int patientId)
        {
            return await _context.Tests
                .Include(t => t.Patient)
                .Include(t => t.Service)
                .Include(t => t.Employee)
                .Where(t => t.PatientId == patientId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Test>> GetByEmployeeIdAsync(int employeeId)
        {
            return await _context.Tests
                .Include(t => t.Patient)
                .Include(t => t.Service)
                .Include(t => t.Employee)
                .Where(t => t.EmployeeId == employeeId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Test>> GetByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return await _context.Tests
                .Include(t => t.Patient)
                .Include(t => t.Service)
                .Include(t => t.Employee)
                .Where(t => t.Date >= startDate && t.Date <= endDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Test>> GetWithDetailsAsync()
        {
            return await _context.Tests
                .Include(t => t.Patient)
                .Include(t => t.Service)
                .Include(t => t.Employee)
                .ToListAsync();
        }

        public async Task<Test?> GetWithDetailsByIdAsync(int id)
        {
            return await _context.Tests
                .Include(t => t.Patient)
                .Include(t => t.Service)
                .Include(t => t.Employee)
                .FirstOrDefaultAsync(t => t.Id == id);
        }
    }
}