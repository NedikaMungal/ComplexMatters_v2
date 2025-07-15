using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    [Table("UnitTypes")] 
     public class UnitType
    {
        [Key]
        public int UnitTypeId { get; set; }
        public required string Description { get; set; }
    }
}