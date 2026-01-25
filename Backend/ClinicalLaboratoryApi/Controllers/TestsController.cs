using ClinicalLaboratory.Data.Models;
using ClinicalLaboratory.Domain.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ClinicalLaboratoryApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = "Bearer")]
    public class TestsController : ControllerBase
    {
        private readonly ITestService _testService;
        private readonly IAuthService _authService;

        public TestsController(ITestService testService, IAuthService authService)
        {
            _testService = testService;
            _authService = authService;
        }

        /// <summary>
        /// Get all tests (Employee only)
        /// </summary>
        [HttpGet]
        [Authorize(Roles = "Employee, Admin")]
        public async Task<IActionResult> GetAllTests()
        {
            var tests = await _testService.GetAllTestsAsync();
            return Ok(tests);
        }

        /// <summary>
        /// Get test by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTestById(int id)
        {
            var test = await _testService.GetTestByIdAsync(id);
            if (test == null)
                return NotFound(new { Message = $"Test with ID {id} not found" });

            var currentUserId = await _authService.GetCurrentUserIdAsync();
            var isEmployee = User.IsInRole("Employee");

            // Patients can only view their own tests
            if (!isEmployee && test.Patient?.ApplicationUserId != currentUserId)
                return Forbid();

            return Ok(test);
        }

        /// <summary>
        /// Get tests for current patient (Patient only)
        /// </summary>
        [HttpGet("my-tests")]
        [Authorize(Roles = "Patient")]
        public async Task<IActionResult> GetMyTests()
        {
            var currentUserId = await _authService.GetCurrentUserIdAsync();
            var tests = await _testService.GetPatientTestsAsync(currentUserId);
            return Ok(tests);
        }

        /// <summary>
        /// Get tests registered by current employee (Employee only)
        /// </summary>
        [HttpGet("employee-tests")]
        [Authorize(Roles = "Employee")]
        public async Task<IActionResult> GetEmployeeTests()
        {
            var currentUserId = await _authService.GetCurrentUserIdAsync();
            var tests = await _testService.GetEmployeeTestsAsync(currentUserId);
            return Ok(tests);
        }

        /// <summary>
        /// Get tests by patient ID (Employee only)
        /// </summary>
        [HttpGet("patient/{patientId}")]
        [Authorize(Roles = "Employee")]
        public async Task<IActionResult> GetTestsByPatientId(int patientId)
        {
            var tests = await _testService.GetTestsByPatientIdAsync(patientId);
            return Ok(tests);
        }

        /// <summary>
        /// Get tests by employee ID (Employee only)
        /// </summary>
        [HttpGet("employee/{employeeId}")]
        [Authorize(Roles = "Employee")]
        public async Task<IActionResult> GetTestsByEmployeeId(int employeeId)
        {
            var tests = await _testService.GetTestsByEmployeeIdAsync(employeeId);
            return Ok(tests);
        }

        /// <summary>
        /// Create new test (Employee only)
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "Employee")]
        public async Task<IActionResult> CreateTest([FromBody] CreateTestRequest request)
        {
            try
            {
                var test = new Test
                {
                    PatientId = request.PatientId,
                    ServiceId = request.ServiceId,
                    EmployeeId = request.EmployeeId,
                    Date = request.Date ?? DateTime.UtcNow
                };

                var createdTest = await _testService.CreateTestAsync(test);
                return CreatedAtAction(nameof(GetTestById), new { id = createdTest.Id }, createdTest);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        /// <summary>
        /// Update test (Employee only)
        /// </summary>
        [HttpPut("{id}")]
        [Authorize(Roles = "Employee")]
        public async Task<IActionResult> UpdateTest(int id, [FromBody] Test test)
        {
            if (id != test.Id)
                return BadRequest(new { Message = "ID mismatch" });

            try
            {
                await _testService.UpdateTestAsync(test);
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
        /// Delete test (Employee only)
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Roles = "Employee")]
        public async Task<IActionResult> DeleteTest(int id)
        {
            try
            {
                await _testService.DeleteTestAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { Message = ex.Message });
            }
        }
    }

    public class CreateTestRequest
    {
        public int PatientId { get; set; }
        public int ServiceId { get; set; }
        public int EmployeeId { get; set; }
        public DateTime? Date { get; set; }
    }
}