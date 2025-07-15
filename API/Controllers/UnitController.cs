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
    public class UnitController(DataContext context, IMapper mapper) : BaseApiController
    {
        [HttpGet("getallunits")]
        public async Task<ActionResult<IEnumerable<Complex>>> GetAllUnits()
        {
            var units = await context.Units
                                    .Include(ut => ut.UnitType)
                                    .ToArrayAsync();
            return Ok(units);
        }

        [HttpGet("getunitsbycomplexid/{complexId}")]
        public async Task<ActionResult<IEnumerable<Complex>>> GetUnitsByComplexId(int complexId)
        {
            var units = await context.Units
                                    .Include(ut => ut.UnitType)
                                    .Select(u => new
                                    {
                                        UnitId = u.UnitId,
                                        UnitNumber = u.UnitNumber,
                                        ComplexId = u.ComplexId,
                                        UnitType = u.UnitType,
                                        OwnerCount = (context.UnitOwners.Count(x => x.UnitId == u.UnitId))
                                    })
                                    .Where(x => x.ComplexId == complexId)
                                    .ToListAsync();
            return Ok(units);
        }

        [HttpGet("getunitbyunitid/{unitId}")]
        public async Task<ActionResult<Unit>> GetUnitByUnitId(int unitId)
        {
            var unit = await context.Units
                             .Include(ut => ut.UnitType)
                            .Select(u => new
                            {
                                UnitId = u.UnitId,
                                UnitNumber = u.UnitNumber,
                                ComplexId = u.ComplexId,
                                UnitTypeId = u.UnitTypeId,
                                UnitType = u.UnitType,
                                OwnerCount = (context.UnitOwners.Count(x => x.UnitId == u.UnitId))
                            })

                             .FirstOrDefaultAsync(x => x.UnitId == unitId);
            return Ok(unit);
        }

        [HttpPost("createupdateunit")] // unit/create
        public async Task<ActionResult<UnitDto>> CreateUpdateUnit(UnitDto unitDto)
        {
            //todo: validation
            // if (await UnitExists(unitDto)) return BadRequest("A unit with that unit number already exists in the complex");
            var unit = mapper.Map<Unit>(unitDto);
            if (unitDto.UnitId == 0) context.Units.Add(unit);
            if (unitDto.UnitId > 0) context.Units.Update(unit);
            await context.SaveChangesAsync();
            return new UnitDto
            {
                UnitId = unit.UnitId,
                ComplexId = unit.ComplexId,
                UnitNumber = unit.UnitNumber,
                UnitTypeId = unit.UnitTypeId
            };
        }

        private async Task<bool> UnitExists(UnitDto unitDto)
        {
            return await context.Units.AnyAsync(x => x.ComplexId == unitDto.ComplexId
                                 && x.UnitNumber.Replace(" ", "") == unitDto.UnitNumber.Replace(" ", ""));
        }

        [HttpGet("getunittypes")]
        public async Task<ActionResult<IEnumerable<UnitType>>> GetUnitTypes()
        {
            var unittypes = await context.UnitTypes
                                     .ToArrayAsync();
            return Ok(unittypes);
        }

               [HttpDelete("deleteunitbyunitid/{unitId}")]
        public async Task<ActionResult> DeleteComplexByComplexId(int complexId)
        {
            var complex = await context.Complexes.FirstOrDefaultAsync(x => x.ComplexId == complexId);
            if (complex == null)
            {
                return NotFound();
            }
            context.Complexes.Remove(complex);
            await context.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet(Name = "GetHelloUnit")]
        public string Get()
        {
            return "Hello World Unit!";
        }

    }
}