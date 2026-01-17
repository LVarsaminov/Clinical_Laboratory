namespace ClinicalLaboratory.Data.Models
{
    public class Hospital
    {
        public int Id { get; set; }

        public string Name { get; set; }
        public string Address { get; set; }
        public ICollection<Laboratory> Laboratories { get; set; }
    }
}
