namespace ClinicalLaboratory.Data.Models
{
    public class Employee
    {
        public int Id { get; set; }
        public string ApplicationUserId { get; set; }
        public ApplicationUser User { get; set; }

        public string FullName { get; set; }
        public int LaboratoryId { get; set; }
        public Laboratory Laboratory { get; set; }

        public ICollection<Test> RegisteredTests { get; set; }
    }
}
