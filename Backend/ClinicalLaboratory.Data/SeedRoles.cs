using Microsoft.AspNetCore.Identity;

namespace ClinicalLaboratory.Data
{
    public enum UserRoles
    {
        Patient,
        Employee 
    }

    public static class SeedRoles
    {
        public static async Task Initialize(RoleManager<IdentityRole> roleManager)
        {
            string[] roleNames = Enum.GetNames<UserRoles>();

            foreach (var roleName in roleNames)
            {
                var roleExists = await roleManager.RoleExistsAsync(roleName);
                if (!roleExists)
                {
                    await roleManager.CreateAsync(new IdentityRole(roleName));
                }
            }
        }
    }
}
