using ClinicalLaboratory.Data.Models;
using ClinicalLaboratory.Data.Repositories;
using ClinicalLaboratory.Domain.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ClinicalLaboratoryApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = "Bearer")]
    public class LaboratoriesController : ControllerBase
    {
        private readonly ILaboratoryRepository _laboratoryRepository;
        private readonly IEmployeeRepository _employeeRepository;
        private readonly IAuthService _authService;

        public LaboratoriesController(
            ILaboratoryRepository laboratoryRepository,
            IEmployeeRepository employeeRepository,
            IAuthService authService)
        {
            _laboratoryRepository = laboratoryRepository;
            _employeeRepository = employeeRepository;
            _authService = authService;
        }

        /// <summary>
        /// Get all laboratories (Employee only)
        /// </summary>
        [HttpGet]
        [Authorize(Roles = "Employee")]
        public async Task<IActionResult> GetAllLaboratories()
        {
            try
            {
                var laboratories = await _laboratoryRepository.GetAllAsync();
                var laboratoryDtos = laboratories.Select(l => new LaboratoryDto
                {
                    Id = l.Id,
                    Name = l.Name,
                    HospitalId = l.HospitalId,
                    HospitalName = l.Hospital?.Name,
                    TotalEmployees = l.Employees?.Count ?? 0
                });

                return Ok(laboratoryDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500,
                    new { Message = "An error occurred while retrieving laboratories", Error = ex.Message });
            }
        }

        /// <summary>
        /// Get laboratory by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetLaboratoryById(int id)
        {
            try
            {
                var laboratory = await _laboratoryRepository.GetWithHospitalAsync(id);
                if (laboratory == null)
                    return NotFound(new { Message = $"Laboratory with ID {id} not found" });

                // Check if user has access
                var currentUserId = await _authService.GetCurrentUserIdAsync();
                var isEmployee = User.IsInRole("Employee");

                if (!isEmployee)
                    return Forbid();

                // Employees can only access their own laboratory's details
                var employee = await _employeeRepository.GetByUserIdAsync(currentUserId);
                if (employee == null || (employee.LaboratoryId != id && !User.IsInRole("Admin")))
                    return Forbid();

                var laboratoryDto = new LaboratoryDetailDto
                {
                    Id = laboratory.Id,
                    Name = laboratory.Name,
                    HospitalId = laboratory.HospitalId,
                    HospitalName = laboratory.Hospital?.Name,
                    HospitalAddress = laboratory.Hospital?.Address,
                    Employees = laboratory.Employees?.Select(e => new EmployeeDto
                    {
                        Id = e.Id,
                        FullName = e.FullName,
                        Email = e.User?.Email
                    }).ToList(),
                    CreatedAt = DateTime.UtcNow
                };

                return Ok(laboratoryDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500,
                    new { Message = "An error occurred while retrieving laboratory", Error = ex.Message });
            }
        }

        /// <summary>
        /// Get laboratories by hospital ID (Employee only)
        /// </summary>
        [HttpGet("hospital/{hospitalId}")]
        [Authorize(Roles = "Employee")]
        public async Task<IActionResult> GetLaboratoriesByHospitalId(int hospitalId)
        {
            try
            {
                var laboratories = await _laboratoryRepository.GetByHospitalIdAsync(hospitalId);
                var laboratoryDtos = laboratories.Select(l => new LaboratoryDto
                {
                    Id = l.Id,
                    Name = l.Name,
                    HospitalId = l.HospitalId,
                    HospitalName = l.Hospital?.Name,
                    TotalEmployees = l.Employees?.Count ?? 0
                });

                return Ok(laboratoryDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500,
                    new { Message = "An error occurred while retrieving laboratories", Error = ex.Message });
            }
        }

        /// <summary>
        /// Get current user's laboratory (Employee only)
        /// </summary>
        [HttpGet("my-laboratory")]
        [Authorize(Roles = "Employee")]
        public async Task<IActionResult> GetMyLaboratory()
        {
            try
            {
                var currentUserId = await _authService.GetCurrentUserIdAsync();
                var employee = await _employeeRepository.GetByUserIdAsync(currentUserId);

                if (employee == null)
                    return NotFound(new { Message = "Employee profile not found" });

                var laboratory = await _laboratoryRepository.GetWithHospitalAsync(employee.LaboratoryId);
                if (laboratory == null)
                    return NotFound(new { Message = "Laboratory not found" });

                var laboratoryDto = new LaboratoryDetailDto
                {
                    Id = laboratory.Id,
                    Name = laboratory.Name,
                    HospitalId = laboratory.HospitalId,
                    HospitalName = laboratory.Hospital?.Name,
                    HospitalAddress = laboratory.Hospital?.Address,
                    Employees = laboratory.Employees?.Select(e => new EmployeeDto
                    {
                        Id = e.Id,
                        FullName = e.FullName,
                        Email = e.User?.Email
                    }).ToList()
                };

                return Ok(laboratoryDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500,
                    new { Message = "An error occurred while retrieving laboratory", Error = ex.Message });
            }
        }

        /// <summary>
        /// Create new laboratory (Admin/Manager only)
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "Employee,Admin")]
        public async Task<IActionResult> CreateLaboratory([FromBody] CreateLaboratoryRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var laboratory = new Laboratory
                {
                    Name = request.Name,
                    HospitalId = request.HospitalId
                };

                var createdLaboratory = await _laboratoryRepository.AddAsync(laboratory);

                var laboratoryDto = new LaboratoryDto
                {
                    Id = createdLaboratory.Id,
                    Name = createdLaboratory.Name,
                    HospitalId = createdLaboratory.HospitalId,
                    TotalEmployees = 0
                };

                return CreatedAtAction(nameof(GetLaboratoryById), new { id = createdLaboratory.Id }, laboratoryDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500,
                    new { Message = "An error occurred while creating laboratory", Error = ex.Message });
            }
        }

        /// <summary>
        /// Update laboratory (Admin/Manager only)
        /// </summary>
        [HttpPut("{id}")]
        [Authorize(Roles = "Employee")]
        public async Task<IActionResult> UpdateLaboratory(int id, [FromBody] UpdateLaboratoryRequest request)
        {
            try
            {
                var laboratory = await _laboratoryRepository.GetByIdAsync(id);
                if (laboratory == null)
                    return NotFound(new { Message = $"Laboratory with ID {id} not found" });

                laboratory.Name = request.Name;
                laboratory.HospitalId = request.HospitalId;

                await _laboratoryRepository.UpdateAsync(laboratory);

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500,
                    new { Message = "An error occurred while updating laboratory", Error = ex.Message });
            }
        }

        /// <summary>
        /// Delete laboratory (Admin only)
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Roles = "Employee")]
        public async Task<IActionResult> DeleteLaboratory(int id)
        {
            try
            {
                var laboratory = await _laboratoryRepository.GetByIdAsync(id);
                if (laboratory == null)
                    return NotFound(new { Message = $"Laboratory with ID {id} not found" });

                // Check if laboratory has employees
                if (laboratory.Employees != null && laboratory.Employees.Any())
                    return BadRequest(new { Message = "Cannot delete laboratory with existing employees" });

                await _laboratoryRepository.DeleteAsync(laboratory);

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500,
                    new { Message = "An error occurred while deleting laboratory", Error = ex.Message });
            }
        }

        /// <summary>
        /// Get laboratory statistics (Employee only)
        /// </summary>
        [HttpGet("{id}/statistics")]
        [Authorize(Roles = "Employee")]
        public async Task<IActionResult> GetLaboratoryStatistics(int id)
        {
            try
            {
                var laboratory = await _laboratoryRepository.GetWithHospitalAsync(id);
                if (laboratory == null)
                    return NotFound(new { Message = $"Laboratory with ID {id} not found" });

                // In a real scenario, you would fetch test statistics from a service
                var statistics = new LaboratoryStatisticsDto
                {
                    LaboratoryId = laboratory.Id,
                    LaboratoryName = laboratory.Name,
                    TotalEmployees = laboratory.Employees?.Count ?? 0,
                    TotalTestsToday = 0, // You would calculate this
                    TotalTestsThisMonth = 0, // You would calculate this
                    ActivePatients = 0, // You would calculate this
                    RevenueThisMonth = 0 // You would calculate this
                };

                return Ok(statistics);
            }
            catch (Exception ex)
            {
                return StatusCode(500,
                    new { Message = "An error occurred while retrieving statistics", Error = ex.Message });
            }
        }
    }

    // DTOs for Laboratory
    public class LaboratoryDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int HospitalId { get; set; }
        public string HospitalName { get; set; }
        public int TotalEmployees { get; set; }
    }

    public class LaboratoryDetailDto : LaboratoryDto
    {
        public string HospitalAddress { get; set; }
        public List<EmployeeDto> Employees { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class EmployeeDto
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
    }

    public class CreateLaboratoryRequest
    {
        public string Name { get; set; }
        public int HospitalId { get; set; }
    }

    public class UpdateLaboratoryRequest
    {
        public string Name { get; set; }
        public int HospitalId { get; set; }
    }

    public class LaboratoryStatisticsDto
    {
        public int LaboratoryId { get; set; }
        public string LaboratoryName { get; set; }
        public int TotalEmployees { get; set; }
        public int TotalTestsToday { get; set; }
        public int TotalTestsThisMonth { get; set; }
        public int ActivePatients { get; set; }
        public decimal RevenueThisMonth { get; set; }
    }
}