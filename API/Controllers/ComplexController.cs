using System.Text.Json;
using System.Text.Json.Serialization;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding.Binders;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class ComplexController(DataContext context, IMapper mapper) : BaseApiController
    {
        [HttpGet("getcomplexbycomplexid/{complexId}")]
        public async Task<ActionResult<Complex>> GetComplexByComplexId(int complexId)
        {
            var complex = await context.Complexes
                              .FirstOrDefaultAsync(x => x.ComplexId == complexId);
            return Ok(complex);
        }

        [HttpGet("getallcomplexes")]
        public async Task<ActionResult<IEnumerable<Complex>>> GetAllComplexes()
        {
            //var complexes = await context.Complexes.ToArrayAsync();
            //return Ok(complexes);

            var complexes = await context.Complexes
                                    .Select(c => new
                                    {
                                        ComplexId = c.ComplexId,
                                        Name = c.Name,
                                        FullAddress = string.Concat(c.AddressLine1, c.AddressLine2),
                                        AddressLine1 = c.AddressLine1,
                                        Suburb = c.Suburb,
                                        City = c.City,
                                        Province = c.Province,
                                        PostalCode = c.PostalCode,
                                        UnitCount = (context.Units.Count(u => u.ComplexId == c.ComplexId))
                                    }).ToListAsync();
            return Ok(complexes);



        }

        [HttpPost("createupdate")] // complex/createupdate
        public async Task<ActionResult<ComplexDto>> CreateUpdate(ComplexDto complexDto)
        {
            if (await ComplexExists(complexDto)) return BadRequest("A Complex with that Name already exists at that address.");
            var complex = mapper.Map<Complex>(complexDto);
            if (complexDto.ComplexId == 0) context.Complexes.Add(complex);
            if (complexDto.ComplexId > 0) context.Complexes.Update(complex);
            await context.SaveChangesAsync();
            return new ComplexDto
            {
                ComplexId = complex.ComplexId,
                Name = complex.Name,
                AddressLine1 = complex.AddressLine1
            };

        }

        private async Task<bool> ComplexExists(ComplexDto complexDto)
        {
            var complexNameCleaned = complexDto.Name.Replace(" ", "").ToLower();
            var complexAddressLine1Cleaned = complexDto.AddressLine1.Replace(" ", "").ToLower();
            if (complexDto.ComplexId == 0)
            {
                return await context.Complexes.AnyAsync(x => x.Name.Replace(" ", "").ToLower() == complexNameCleaned
                                                        && x.AddressLine1.Replace(" ", "").ToLower() == complexAddressLine1Cleaned);
            }
            else
            {
                return await context.Complexes.AnyAsync(x => x.Name.Replace(" ", "").ToLower() == complexNameCleaned
                                                        && x.AddressLine1.Replace(" ", "").ToLower() == complexAddressLine1Cleaned
                                                        && x.ComplexId != complexDto.ComplexId
                                                        );

            }
        }

        [HttpDelete("deletecomplexbycomplexid/{complexid}")]
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

        [HttpGet(Name = "GetHelloComplex")]
        public string Get()
        {
            return "Hello World Complex!";
        }
    }
}