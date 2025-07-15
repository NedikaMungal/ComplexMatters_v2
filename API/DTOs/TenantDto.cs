using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;

namespace API.DTOs
{
    public class TenantDto
    {
        public int TenantId { get; set; }
        public required string FullName { get; set; }
        public required string IdNumber { get; set; }

        public required string Email { get; set; }
        public required string Phone { get; set; }

        [ForeignKey("Unit")]
        public int UnitId { get; set; }
        public Unit? Unit { get; set; }
    }
}