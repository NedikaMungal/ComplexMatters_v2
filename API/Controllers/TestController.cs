using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class TestController(DataContext context, IMapper mapper) : BaseApiController
    {

        [HttpGet(Name = "GetHelloTest")]
        public string Get()
        {
            return "Hello World Test!";
        }
        
    }
}