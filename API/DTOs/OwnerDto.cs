using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class OwnerDto
    {
        public int OwnerId { get; set; }
        public required string FullName { get; set; }
        public required string IdNumber { get; set; }
        public required string Email { get; set; }
        public required string Cellphone { get; set; }
        public required int UnitId { get; set; }
    }
}