using System.Security.Claims;
using ClinicalLaboratory.Data.Models;
using ClinicalLaboratory.Domain.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;

namespace ClinicalLaboratory.Domain.Services
{
    public interface IAuthService
    {
        Task<AuthResponse> RegisterUserAsync(RegisterRequest request);
        Task<AuthResponse> LoginAsync(LoginRequest request);
        Task LogoutAsync();
        Task<ApplicationUser> GetCurrentUserAsync();
        Task<string> GetCurrentUserIdAsync();
        Task<bool> IsInRoleAsync(string userId, string role);
    }

    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ApplicationDbContext _context;
        private readonly ITokenService _tokenService;

        public AuthService(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IHttpContextAccessor httpContextAccessor,
            ApplicationDbContext context,
            ITokenService tokenService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _httpContextAccessor = httpContextAccessor;
            _context = context;
            _tokenService = tokenService;
        }

        public async Task<AuthResponse> RegisterUserAsync(RegisterRequest request)
        {
            var user = new ApplicationUser
            {
                UserName = request.Email,
                Email = request.Email
            };

            var result = await _userManager.CreateAsync(user, request.Password);

            if (!result.Succeeded)
            {
                return new AuthResponse
                {
                    Success = false,
                    Errors = result.Errors.Select(e => e.Description).ToList()
                };
            }

            await _userManager.AddToRoleAsync(user, request.Role);

            if (request.Role == "Patient")
            {
                var patient = new Patient
                {
                    ApplicationUserId = user.Id,
                    FullName = request.FullName,
                    EGN = request.EGN!
                };
                _context.Patients.Add(patient);
            }
            else if (request.Role == "Employee")
            {
                var employee = new Employee
                {
                    ApplicationUserId = user.Id,
                    FullName = request.FullName,
                    LaboratoryId = request.LaboratoryId ?? 1 // Default laboratory if not specified
                };
                _context.Employees.Add(employee);
            }

            await _context.SaveChangesAsync();

            // Generate JWT token
            var token = await _tokenService.GenerateTokenAsync(user);

            return new AuthResponse
            {
                Success = true,
                Token = token,
                UserId = user.Id,
                Email = user.Email,
                Roles = new List<string> { request.Role }
            };
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);

            if (user == null)
            {
                return new AuthResponse
                {
                    Success = false,
                    Errors = new List<string> { "User not found" }
                };
            }

            var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);

            if (!result.Succeeded)
            {
                return new AuthResponse
                {
                    Success = false,
                    Errors = new List<string> { "Invalid password" }
                };
            }

            // Generate JWT token
            var token = await _tokenService.GenerateTokenAsync(user);
            var roles = await _userManager.GetRolesAsync(user);

            return new AuthResponse
            {
                Success = true,
                Token = token,
                UserId = user.Id,
                Email = user.Email,
                Roles = roles.ToList()
            };
        }

        public async Task LogoutAsync()
        {
            await _signInManager.SignOutAsync();
        }

        public async Task<ApplicationUser> GetCurrentUserAsync()
        {
            var userId = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return null;

            return await _userManager.FindByIdAsync(userId);
        }

        public async Task<string> GetCurrentUserIdAsync()
        {
            var user = await GetCurrentUserAsync();
            return user?.Id;
        }

        public async Task<bool> IsInRoleAsync(string userId, string role)
        {
            var user = await _userManager.FindByIdAsync(userId);
            return user != null && await _userManager.IsInRoleAsync(user, role);
        }
    }

    public class RegisterRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
        public string FullName { get; set; }
        public string? EGN { get; set; }
        public int? LaboratoryId { get; set; }
    }

    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class AuthResponse
    {
        public bool Success { get; set; }
        public string Token { get; set; }
        public string UserId { get; set; }
        public string Email { get; set; }
        public List<string> Roles { get; set; }
        public List<string> Errors { get; set; }
    }
}