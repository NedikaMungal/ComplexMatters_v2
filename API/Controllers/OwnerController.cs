using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SQLitePCL;

namespace API.Controllers
{
    public class OwnerController(DataContext context, IMapper mapper) : BaseApiController
    {
        [HttpGet("getownersbyunitid/{unitId}")]
        public async Task<ActionResult<IEnumerable<Owner>>> GetOwnersByUnitId(int unitId)
        {
            var owners = await context.UnitOwners.Where(x => x.UnitId == unitId)
                                      .Select(o => o.Owner).ToListAsync();



            return Ok(owners);
        }

        [HttpGet("getownerbyownerid/{ownerId}")]
        public async Task<ActionResult<Owner>> GetOwnerByOwnerId(int ownerId)
        {
            var owner = await context.Owners.FirstOrDefaultAsync(x => x.OwnerId == ownerId);
            return Ok(owner);
        }

        [HttpPost("createupdateowner")] // owner/create
        public async Task<ActionResult<OwnerDto>> CreateUpdateOwner(OwnerDto ownerDto)
        {
            if (await OwnerExists(ownerDto)) return BadRequest("An owner with that Id Number already exists.");
            var owner = mapper.Map<Owner>(ownerDto);
            if (ownerDto.OwnerId == 0)
            {
                var unitowner = new UnitOwner
                {
                    UnitId = ownerDto.UnitId,
                    OwnerId = owner.OwnerId
                };
                owner.UnitOwners.Add(unitowner);
                 context.Owners.Add(owner);
            }
            else
            {
                context.Owners.Update(owner);
            }
            await context.SaveChangesAsync();
            return new OwnerDto
            {
                OwnerId = owner.OwnerId,
                FullName = owner.FullName,
                IdNumber = owner.IdNumber,
                Email = owner.Email,
                Cellphone = owner.Cellphone,
                UnitId = ownerDto.UnitId
            };
        }

        private async Task<bool> OwnerExists(OwnerDto ownerDto)
        {
            return await context.Owners.AnyAsync(x => x.OwnerId == ownerDto.OwnerId
                                 && x.IdNumber == ownerDto.IdNumber);
        }


        [HttpDelete("deleteownerbyownerid/{ownerId}")]
        public async Task<ActionResult> DeleteOwnerByOwnerId(int ownerId)
        {
            var owner = await context.Owners.FirstOrDefaultAsync(x => x.OwnerId == ownerId);
            if (owner == null)
            {
                return NotFound();
            }
            context.Owners.Remove(owner);
            await context.SaveChangesAsync();
            return NoContent();
        }


        [HttpGet(Name = "gethelloowner")]
        public string Get()
        {
            return "Hello World Owner!";
        }

    }
}