namespace ClinicalLaboratory.Data.Models
{
    public class Laboratory
    {
        public int Id { get; set; }

        public string Name { get; set; }
        public int HospitalId { get; set; }
        public Hospital Hospital { get; set; }
        public ICollection<Employee> Employees { get; set; }
    }
}
