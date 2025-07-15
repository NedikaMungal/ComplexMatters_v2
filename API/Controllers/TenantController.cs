using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using CloudinaryDotNet.Core;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class TenantController(DataContext context, IMapper mapper) : BaseApiController
    {
        [HttpPost("create")] // tenant/create
        public async Task<ActionResult<TenantDto>> Create(TenantDto tenantDto)
        {
            if (await TenantExists(tenantDto.IdNumber)) return BadRequest("A tenant with that Id Number already exists.");
            var tenant = mapper.Map<Tenant>(tenantDto);
            context.Tenants.Add(tenant);
            await context.SaveChangesAsync();
            return new TenantDto
            {
                FullName = tenant.FullName,
                IdNumber = tenant.IdNumber,
                Email = tenant.Email,
                Phone = tenant.Phone
            };
        }

        private async Task<bool> TenantExists(string idnumber)
        {
            return await context.Tenants.AnyAsync(x => x.IdNumber == idnumber);
        }
     
        
    }
}