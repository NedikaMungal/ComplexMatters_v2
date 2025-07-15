using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;

namespace API.DTOs
{
    public class UnitDto
    {
        public int UnitId { get; set; }

        public required string  UnitNumber { get; set; }

        [ForeignKey("Complex")]
        public int ComplexId { get; set; }

        public Complex? Complex { get; set; }

        [ForeignKey("Owner")]
        public int? OwnerId { get; set; }
        public Owner? Owner { get; set; }

        [ForeignKey("UnitType")]
        public required int UnitTypeId { get; set; }
        public UnitType? UnitType { get; set; }


        [ForeignKey("Tenant")]
        public int? TenantId { get; set; }

        public Tenant? Tenant { get; set; }
    }
}