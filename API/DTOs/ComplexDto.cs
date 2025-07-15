using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class ComplexDto
    {
        public required int ComplexId { get; set; }
        [Required]
        public required string Name { get; set; }
        [Required]
        public required string AddressLine1 { get; set; }
        public string? AddressLine2 { get; set; }
        public string? Suburb { get; set; }
        public string? City { get; set; }
        public string? Province  { get; set; }
        public string? PostalCode { get; set; }
    }
}