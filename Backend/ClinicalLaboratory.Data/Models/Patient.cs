namespace ClinicalLaboratory.Data.Models
{
    public class Patient
    {
        public int Id { get; set; }
        public string ApplicationUserId { get; set; }
        public ApplicationUser User { get; set; }

        public string FullName { get; set; }
        public string EGN { get; set; }

        public ICollection<Test> Tests { get; set; }
    }
}
