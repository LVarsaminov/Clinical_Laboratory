using ClinicalLaboratory.Domain.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ClinicalLaboratoryApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        /// <summary>
        /// Register a new user with specified role (Patient or Employee)
        /// </summary>
        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Validate role
            if (request.Role != "Patient" && request.Role != "Employee")
                return BadRequest(new { Message = "Role must be either 'Patient' or 'Employee'" });

            // Additional validation for Patients
            if (request.Role == "Patient" && string.IsNullOrEmpty(request.EGN))
                return BadRequest(new { Message = "EGN is required for patients" });

            var result = await _authService.RegisterUserAsync(request);

            if (result.Success)
                return Ok(new
                {
                    Message = "User registered successfully",
                    Token = result.Token,
                    UserId = result.UserId,
                    Email = result.Email,
                    Roles = result.Roles
                });

            return BadRequest(new { Errors = result.Errors });
        }

        /// <summary>
        /// Login user and get JWT token
        /// </summary>
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var result = await _authService.LoginAsync(request);

            if (result.Success)
                return Ok(new
                {
                    Message = "Login successful",
                    Token = result.Token,
                    UserId = result.UserId,
                    Email = result.Email,
                    Roles = result.Roles
                });

            return Unauthorized(new { Errors = result.Errors });
        }

        /// <summary>
        /// Logout user
        /// </summary>
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _authService.LogoutAsync();
            return Ok(new { Message = "Logout successful" });
        }

        /// <summary>
        /// Get current user info
        /// </summary>
        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var user = await _authService.GetCurrentUserAsync();
            if (user == null)
                return Unauthorized();

            return Ok(new
            {
                Id = user.Id,
                Email = user.Email,
                UserName = user.UserName
            });
        }
    }
}