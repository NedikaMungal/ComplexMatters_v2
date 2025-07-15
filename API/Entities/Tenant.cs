
using System.ComponentModel.DataAnnotations.Schema;


namespace API.Entities
{
    [Table("Tenants")]
    public class Tenant
    {
        public int TenantId { get; set; }
        public required string IdNumber { get; set; }
        public required string FullName { get; set; }
        public required string Email { get; set; }
        public required string Phone { get; set; }

        [ForeignKey("Unit")]
        public int UnitId { get; set; }
        public Unit? Unit { get; set; }
    }
}