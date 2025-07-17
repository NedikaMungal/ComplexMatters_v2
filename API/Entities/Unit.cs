
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using CloudinaryDotNet;

namespace API.Entities
{
    [Table("Units")]
    public class Unit
    {
        [Key]
        public int UnitId { get; set; }
        public required string UnitNumber { get; set; }

        [ForeignKey("Complex")]
        public int ComplexId { get; set; }

        public Complex? Complex { get; set; }

        [JsonIgnore]
        public ICollection<UnitOwner>? UnitOwners { get; set; }

        [ForeignKey("UnitType")]
        public required int UnitTypeId { get; set; }
        public required UnitType UnitType { get; set; }

        [ForeignKey("Tenant")]
        public int? TenantId { get; set; }

        public Tenant? Tenant { get; set; }
    }

}