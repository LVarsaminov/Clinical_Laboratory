using ClinicalLaboratory.Data.Models;
using ClinicalLaboratory.Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

public class ApplicationDbContext
    : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<ApplicationUser> ApplicationUsers { get; set; }

    public DbSet<Hospital> Hospitals { get; set; }
    public DbSet<Laboratory> Laboratories { get; set; }
    public DbSet<Employee> Employees { get; set; }
    public DbSet<Patient> Patients { get; set; }
    public DbSet<Service> Services { get; set; }
    public DbSet<Test> Tests { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Patient>()
            .HasOne(p => p.User)
            .WithOne()
            .HasForeignKey<Patient>(p => p.ApplicationUserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Patient>()
            .HasIndex(p => p.ApplicationUserId)
            .IsUnique();

        builder.Entity<Employee>()
            .HasOne(e => e.User)
            .WithOne()
            .HasForeignKey<Employee>(e => e.ApplicationUserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Employee>()
            .HasIndex(e => e.ApplicationUserId)
            .IsUnique();

        builder.Entity<Laboratory>()
            .HasOne(l => l.Hospital)
            .WithMany(h => h.Laboratories)
            .HasForeignKey(l => l.HospitalId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<Employee>()
            .HasOne(e => e.Laboratory)
            .WithMany(l => l.Employees)
            .HasForeignKey(e => e.LaboratoryId)
            .OnDelete(DeleteBehavior.Restrict);

       
        builder.Entity<Test>()
            .HasOne(t => t.Patient)
            .WithMany(p => p.Tests)
            .HasForeignKey(t => t.PatientId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Test>()
            .HasOne(t => t.Employee)
            .WithMany(e => e.RegisteredTests)
            .HasForeignKey(t => t.EmployeeId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Test>()
            .HasOne(t => t.Service)
            .WithMany(s => s.Tests)
            .HasForeignKey(t => t.ServiceId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Hospital>()
            .Property(h => h.Name)
            .IsRequired();

        builder.Entity<Laboratory>()
            .Property(l => l.Name)
            .IsRequired();

        builder.Entity<Employee>()
            .Property(e => e.FullName)
            .IsRequired();

        builder.Entity<Patient>()
            .Property(p => p.FullName)
            .IsRequired();

        builder.Entity<Service>()
            .Property(s => s.Name)
            .IsRequired();
    }
}
