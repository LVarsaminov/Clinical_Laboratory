using ClinicalLaboratory.Data.Models;

namespace ClinicalLaboratory.Domain
{
    public class Test
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public Patient Patient { get; set; }
        public int ServiceId { get; set; }
        public Service Service { get; set; }
        public int EmployeeId { get; set; }
        public Employee Employee { get; set; }
        public DateTime Date { get; set; }
    }
}
