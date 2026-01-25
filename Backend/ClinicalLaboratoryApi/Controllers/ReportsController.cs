using ClinicalLaboratory.Domain.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using ClinicalLaboratory.Data.Models;

namespace ClinicalLaboratoryApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = "Bearer", Roles = "Employee, Admin")]
    public class ReportsController : ControllerBase
    {
        private readonly IReportService _reportService;
        private readonly IPatientService _patientService;

        public ReportsController(IReportService reportService)
        {
            _reportService = reportService;
        }

        /// <summary>
        /// Generate laboratory report
        /// </summary>
        [HttpGet("laboratory/{laboratoryId}")]
        [Authorize(Roles = "Employee, Admin")]
        public async Task<IActionResult> GenerateLaboratoryReport(
            int laboratoryId,
            [FromQuery] DateTime startDate,
            [FromQuery] DateTime endDate)
        {
            var report = await _reportService.GenerateLaboratoryReportAsync(laboratoryId, startDate, endDate);
            return Ok(report);
        }

        /// <summary>
        /// Get tests report for employee
        /// </summary>
        [HttpGet("employee/{employeeId}")]
        [Authorize(Roles = "Employee, Admin")]
        public async Task<IActionResult> GetEmployeeTestsReport(
            int employeeId,
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null)
        {
            var tests = await _reportService.GetEmployeeTestsReportAsync(employeeId, startDate, endDate);
            return Ok(tests);
        }

        /// <summary>
        /// Get tests report for patient
        /// </summary>
        [HttpGet("patient/{patientId}")]
        [Authorize(Roles = "Employee, Admin, Patient")]
        public async Task<IActionResult> GetPatientTestsReport(int patientId)
        {
            IEnumerable<Test> tests = new List<Test>();

            if (User.IsInRole("Patient"))
            {
                var currentPatient = _patientService.GetPatientByUserIdAsync(User.FindFirstValue(ClaimTypes.NameIdentifier));
                if (patientId != currentPatient.Id)
                {
                    return BadRequest("A patient can view only their tests.");
                }
                tests = await _reportService.GetPatientTestsReportAsync(patientId);
                return Ok(tests);
            }
            tests = await _reportService.GetPatientTestsReportAsync(patientId);
            return Ok(tests);
        }

        /// <summary>
        /// Generate financial report
        /// </summary>
        [HttpGet("financial/{laboratoryId}")]
        public async Task<IActionResult> GenerateFinancialReport(
            int laboratoryId,
            [FromQuery] DateTime startDate,
            [FromQuery] DateTime endDate)
        {
            var report = await _reportService.GenerateFinancialReportAsync(laboratoryId, startDate, endDate);
            return Ok(report);
        }
    }
}