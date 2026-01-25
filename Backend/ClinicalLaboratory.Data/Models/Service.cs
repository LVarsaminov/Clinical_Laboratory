namespace ClinicalLaboratory.Data.Models
{
    public class Service
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public ICollection<Test>? Tests { get; set; }
    }
}
