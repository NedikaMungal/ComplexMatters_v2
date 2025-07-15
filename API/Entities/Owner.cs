using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace API.Entities
{

    [Table("Owners")]
    public class Owner
    {
        [Key]
        public int OwnerId { get; set; }
        public required string FullName { get; set; }
        public required string IdNumber { get; set; }

        public required string Email { get; set; }
        public required string Cellphone { get; set; }
        [JsonIgnore]
        public ICollection<UnitOwner> UnitOwners { get; set; } = [];

    }

}