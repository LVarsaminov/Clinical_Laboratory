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
    public class HospitalsController : ControllerBase
    {
        private readonly IHospitalRepository _hospitalRepository;
        private readonly ILaboratoryRepository _laboratoryRepository;
        private readonly IAuthService _authService;

        public HospitalsController(
            IHospitalRepository hospitalRepository,
            ILaboratoryRepository laboratoryRepository,
            IAuthService authService)
        {
            _hospitalRepository = hospitalRepository;
            _laboratoryRepository = laboratoryRepository;
            _authService = authService;
        }

        /// <summary>
        /// Get all hospitals (Employee only)
        /// </summary>
        [HttpGet]
        [Authorize(Roles = "Employee")]
        public async Task<IActionResult> GetAllHospitals()
        {
            try
            {
                var hospitals = await _hospitalRepository.GetAllAsync();
                var hospitalDtos = hospitals.Select(h => new HospitalDto
                {
                    Id = h.Id,
                    Name = h.Name,
                    Address = h.Address,
                    TotalLaboratories = h.Laboratories?.Count ?? 0
                });

                return Ok(hospitalDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500,
                    new { Message = "An error occurred while retrieving hospitals", Error = ex.Message });
            }
        }

        /// <summary>
        /// Get hospital by ID
        /// </summary>
        [HttpGet("{id}")]
        [Authorize(Roles = "Employee")]
        public async Task<IActionResult> GetHospitalById(int id)
        {
            try
            {
                var hospital = await _hospitalRepository.GetWithLaboratoriesAsync(id);
                if (hospital == null)
                    return NotFound(new { Message = $"Hospital with ID {id} not found" });

                // Get laboratories for this hospital
                var laboratories = await _laboratoryRepository.GetByHospitalIdAsync(id);

                var hospitalDetailDto = new HospitalDetailDto
                {
                    Id = hospital.Id,
                    Name = hospital.Name,
                    Address = hospital.Address,
                    Laboratories = laboratories.Select(l => new LaboratorySummaryDto
                    {
                        Id = l.Id,
                        Name = l.Name,
                        TotalEmployees = l.Employees?.Count ?? 0
                    }).ToList(),
                    TotalLaboratories = laboratories.Count(),
                    TotalEmployees = laboratories.Sum(l => l.Employees?.Count ?? 0)
                };

                return Ok(hospitalDetailDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500,
                    new { Message = "An error occurred while retrieving hospital", Error = ex.Message });
            }
        }

        /// <summary>
        /// Search hospitals by name or address (Employee only)
        /// </summary>
        [HttpGet("search")]
        [Authorize(Roles = "Employee")]
        public async Task<IActionResult> SearchHospitals([FromQuery] string searchTerm)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(searchTerm))
                    return await GetAllHospitals();

                var allHospitals = await _hospitalRepository.GetAllAsync();
                var filteredHospitals = allHospitals
                    .Where(h => h.Name.Contains(searchTerm, StringComparison.OrdinalIgnoreCase) ||
                                (h.Address != null &&
                                 h.Address.Contains(searchTerm, StringComparison.OrdinalIgnoreCase)))
                    .Select(h => new HospitalDto
                    {
                        Id = h.Id,
                        Name = h.Name,
                        Address = h.Address,
                        TotalLaboratories = h.Laboratories?.Count ?? 0
                    });

                return Ok(filteredHospitals);
            }
            catch (Exception ex)
            {
                return StatusCode(500,
                    new { Message = "An error occurred while searching hospitals", Error = ex.Message });
            }
        }

        /// <summary>
        /// Create new hospital (Admin only)
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "Employee,Admin")]
        public async Task<IActionResult> CreateHospital([FromBody] CreateHospitalRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                // Validate required fields
                if (string.IsNullOrWhiteSpace(request.Name))
                    return BadRequest(new { Message = "Hospital name is required" });

                if (string.IsNullOrWhiteSpace(request.Address))
                    return BadRequest(new { Message = "Hospital address is required" });

                var hospital = new Hospital
                {
                    Name = request.Name.Trim(),
                    Address = request.Address.Trim()
                };

                var createdHospital = await _hospitalRepository.AddAsync(hospital);

                var hospitalDto = new HospitalDto
                {
                    Id = createdHospital.Id,
                    Name = createdHospital.Name,
                    Address = createdHospital.Address,
                    TotalLaboratories = 0
                };

                return CreatedAtAction(nameof(GetHospitalById), new { id = createdHospital.Id }, hospitalDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500,
                    new { Message = "An error occurred while creating hospital", Error = ex.Message });
            }
        }

        /// <summary>
        /// Update hospital (Admin only)
        /// </summary>
        [HttpPut("{id}")]
        [Authorize(Roles = "Employee")]
        public async Task<IActionResult> UpdateHospital(int id, [FromBody] UpdateHospitalRequest request)
        {
            try
            {
                var hospital = await _hospitalRepository.GetByIdAsync(id);
                if (hospital == null)
                    return NotFound(new { Message = $"Hospital with ID {id} not found" });

                // Validate required fields
                if (string.IsNullOrWhiteSpace(request.Name))
                    return BadRequest(new { Message = "Hospital name is required" });

                if (string.IsNullOrWhiteSpace(request.Address))
                    return BadRequest(new { Message = "Hospital address is required" });

                hospital.Name = request.Name.Trim();
                hospital.Address = request.Address.Trim();

                await _hospitalRepository.UpdateAsync(hospital);

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500,
                    new { Message = "An error occurred while updating hospital", Error = ex.Message });
            }
        }

        /// <summary>
        /// Delete hospital (Admin only)
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Roles = "Employee")]
        public async Task<IActionResult> DeleteHospital(int id)
        {
            try
            {
                var hospital = await _hospitalRepository.GetWithLaboratoriesAsync(id);
                if (hospital == null)
                    return NotFound(new { Message = $"Hospital with ID {id} not found" });

                // Check if hospital has laboratories
                if (hospital.Laboratories != null && hospital.Laboratories.Any())
                    return BadRequest(new
                        { Message = "Cannot delete hospital with existing laboratories. Delete laboratories first." });

                await _hospitalRepository.DeleteAsync(hospital);

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500,
                    new { Message = "An error occurred while deleting hospital", Error = ex.Message });
            }
        }

        /// <summary>
        /// Get hospital statistics (Employee only)
        /// </summary>
        [HttpGet("{id}/statistics")]
        [Authorize(Roles = "Employee")]
        public async Task<IActionResult> GetHospitalStatistics(int id)
        {
            try
            {
                var hospital = await _hospitalRepository.GetWithLaboratoriesAsync(id);
                if (hospital == null)
                    return NotFound(new { Message = $"Hospital with ID {id} not found" });

                var laboratories = await _laboratoryRepository.GetByHospitalIdAsync(id);

                var statistics = new HospitalStatisticsDto
                {
                    HospitalId = hospital.Id,
                    HospitalName = hospital.Name,
                    TotalLaboratories = laboratories.Count(),
                    TotalEmployees = laboratories.Sum(l => l.Employees?.Count ?? 0),
                    // These would be calculated from test data in a real scenario
                    TotalTestsToday = 0,
                    TotalTestsThisMonth = 0,
                    TotalPatientsThisMonth = 0,
                    RevenueThisMonth = 0
                };

                return Ok(statistics);
            }
            catch (Exception ex)
            {
                return StatusCode(500,
                    new { Message = "An error occurred while retrieving hospital statistics", Error = ex.Message });
            }
        }

        /// <summary>
        /// Get all hospitals with their laboratories (Employee only)
        /// </summary>
        [HttpGet("with-laboratories")]
        [Authorize(Roles = "Employee")]
        public async Task<IActionResult> GetHospitalsWithLaboratories()
        {
            try
            {
                var hospitals = await _hospitalRepository.GetAllAsync();
                var hospitalDetailDtos = new List<HospitalDetailDto>();

                foreach (var hospital in hospitals)
                {
                    var laboratories = await _laboratoryRepository.GetByHospitalIdAsync(hospital.Id);

                    hospitalDetailDtos.Add(new HospitalDetailDto
                    {
                        Id = hospital.Id,
                        Name = hospital.Name,
                        Address = hospital.Address,
                        Laboratories = laboratories.Select(l => new LaboratorySummaryDto
                        {
                            Id = l.Id,
                            Name = l.Name,
                            TotalEmployees = l.Employees?.Count ?? 0
                        }).ToList(),
                        TotalLaboratories = laboratories.Count(),
                        TotalEmployees = laboratories.Sum(l => l.Employees?.Count ?? 0)
                    });
                }

                return Ok(hospitalDetailDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500,
                    new
                    {
                        Message = "An error occurred while retrieving hospitals with laboratories", Error = ex.Message
                    });
            }
        }
    }

    // DTOs for Hospital
    public class HospitalDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public int TotalLaboratories { get; set; }
    }

    public class HospitalDetailDto : HospitalDto
    {
        public List<LaboratorySummaryDto> Laboratories { get; set; }
        public int TotalEmployees { get; set; }
    }

    public class LaboratorySummaryDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int TotalEmployees { get; set; }
    }

    public class CreateHospitalRequest
    {
        public string Name { get; set; }
        public string Address { get; set; }
    }

    public class UpdateHospitalRequest
    {
        public string Name { get; set; }
        public string Address { get; set; }
    }

    public class HospitalStatisticsDto
    {
        public int HospitalId { get; set; }
        public string HospitalName { get; set; }
        public int TotalLaboratories { get; set; }
        public int TotalEmployees { get; set; }
        public int TotalTestsToday { get; set; }
        public int TotalTestsThisMonth { get; set; }
        public int TotalPatientsThisMonth { get; set; }
        public decimal RevenueThisMonth { get; set; }
    }
}