using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("UnitOwners")]
    public class UnitOwner
    {
        public Unit Unit { get; set; } = null!;
        public int UnitId { get; set; }
        public Owner Owner { get; set; } = null!;
        public int OwnerId { get; set; }
    }
}