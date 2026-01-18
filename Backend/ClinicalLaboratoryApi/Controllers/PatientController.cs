using ClinicalLaboratory.Data.Models;
using ClinicalLaboratory.Domain.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ClinicalLaboratoryApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PatientsController : ControllerBase
    {
        private readonly IPatientService _patientService;
        private readonly IAuthService _authService;

        public PatientsController(IPatientService patientService, IAuthService authService)
        {
            _patientService = patientService;
            _authService = authService;
        }

        /// <summary>
        /// Get all patients (Employee only)
        /// </summary>
        [HttpGet]
        [Authorize(Roles = "Employee")]
        public async Task<IActionResult> GetAllPatients()
        {
            var patients = await _patientService.GetAllPatientsAsync();
            return Ok(patients);
        }

        /// <summary>
        /// Get patient by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPatientById(int id)
        {
            var patient = await _patientService.GetPatientByIdAsync(id);
            if (patient == null)
                return NotFound();

            var currentUserId = await _authService.GetCurrentUserIdAsync();
            var isEmployee = await _authService.IsInRoleAsync(currentUserId, "Employee");

            // Patients can only view their own profile unless they're employees
            if (!isEmployee && patient.ApplicationUserId != currentUserId)
                return Forbid();

            return Ok(patient);
        }

        /// <summary>
        /// Search patients by name or EGN (Employee only)
        /// </summary>
        [HttpGet("search")]
        [Authorize(Roles = "Employee")]
        public async Task<IActionResult> SearchPatients([FromQuery] string searchTerm)
        {
            var patients = await _patientService.SearchPatientsAsync(searchTerm);
            return Ok(patients);
        }

        /// <summary>
        /// Create new patient (Employee only)
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "Employee")]
        public async Task<IActionResult> CreatePatient([FromBody] Patient patient)
        {
            try
            {
                var createdPatient = await _patientService.CreatePatientAsync(patient);
                return CreatedAtAction(nameof(GetPatientById), new { id = createdPatient.Id }, createdPatient);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        /// <summary>
        /// Update patient (Employee only)
        /// </summary>
        [HttpPut("{id}")]
        [Authorize(Roles = "Employee")]
        public async Task<IActionResult> UpdatePatient(int id, [FromBody] Patient patient)
        {
            if (id != patient.Id)
                return BadRequest();

            try
            {
                await _patientService.UpdatePatientAsync(patient);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { Message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        /// <summary>
        /// Delete patient (Employee only)
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Roles = "Employee")]
        public async Task<IActionResult> DeletePatient(int id)
        {
            try
            {
                await _patientService.DeletePatientAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { Message = ex.Message });
            }
        }
    }
}