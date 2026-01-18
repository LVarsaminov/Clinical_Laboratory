using ClinicalLaboratory.Data.Models;
using Microsoft.AspNetCore.Identity;

namespace ClinicalLaboratory.Data
{
    public enum UserRoles
    {
        Patient,
        Employee,
        Admin
    }

    public static class SeedRoles
    {
        public static async Task Initialize(RoleManager<IdentityRole> roleManager,
            UserManager<ApplicationUser> userManager,
            ApplicationDbContext context)
        {
            string[] roleNames = Enum.GetNames(typeof(UserRoles));

            foreach (var roleName in roleNames)
            {
                var roleExists = await roleManager.RoleExistsAsync(roleName);
                if (!roleExists)
                {
                    await roleManager.CreateAsync(new IdentityRole(roleName));
                }
            }

            var adminEmail = "admin@lab.com";
            var adminUser = await userManager.FindByEmailAsync(adminEmail);

            if (adminUser == null)
            {
                adminUser = new ApplicationUser
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    EmailConfirmed = true
                };

                var createAdminResult = await userManager.CreateAsync(adminUser, "Admin@123");

                if (createAdminResult.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, "Admin");

                    var hospital = new Hospital
                    {
                        Name = "Main Hospital",
                        Address = "123 Medical Street, Sofia"
                    };

                    context.Hospitals.Add(hospital);
                    await context.SaveChangesAsync();

                    var laboratory = new Laboratory
                    {
                        Name = "Clinical Laboratory",
                        HospitalId = hospital.Id
                    };

                    context.Laboratories.Add(laboratory);
                    await context.SaveChangesAsync();

                    var adminEmployee = new Employee
                    {
                        ApplicationUserId = adminUser.Id,
                        FullName = "System Administrator",
                        LaboratoryId = laboratory.Id
                    };

                    context.Employees.Add(adminEmployee);
                    await context.SaveChangesAsync();
                }
            }
        }
    }
}