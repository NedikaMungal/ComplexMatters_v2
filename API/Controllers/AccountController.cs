using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Resend;

namespace API.Controllers;

public class AccountController(DataContext context, ITokenService tokenService, IMapper mapper, IResend resend) : BaseApiController
{
    [HttpPost("register")] // account/register
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
        if (await UserExists(registerDto.Username)) return BadRequest("Username is taken");
        using var hmac = new HMACSHA512();
        var user = mapper.Map<AppUser>(registerDto);
        user.UserName = registerDto.Username.ToLower();
        user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password));
        user.PasswordSalt = hmac.Key;

        context.Users.Add(user);
        await context.SaveChangesAsync();
        return new UserDto
        {
            Username = user.UserName,
            KnownAs = user.KnownAs,
            Gender = user.Gender,
            Token = tokenService.CreateToken(user)
        };

    }


    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        var user = await context.Users
                    .Include(x => x.Photos)
                    .FirstOrDefaultAsync(x =>
            x.UserName == loginDto.Username.ToLower());
        if (user == null)
            return Unauthorized("Invalid username");
        try
        {
            //will only execute this code when user is successful
            await ExecuteSend("Can you believe that this actually works!!!");
        }
        catch (Exception ex)
        {

        }


        using var hmac = new HMACSHA512(user.PasswordSalt);
        var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));
        for (int i = 0; i < computedHash.Length; i++)
        {
            if (computedHash[i] != user.PasswordHash[i]) return Unauthorized("Invalid password");
        }

        return new UserDto
        {
            Username = user.UserName,
            Token = tokenService.CreateToken(user),
            Gender = user.Gender,
            KnownAs = user.KnownAs,
            PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url
        };
    }
    private async Task<bool> UserExists(string username)
    {
        return await context.Users.AnyAsync(x => x.UserName.ToLower() == username.ToLower()); // Bob != bob
    }

    public async Task ExecuteSend(string msg)
    {
        var message = new EmailMessage();
        message.From = "Acme <onboarding@resend.dev>";
        message.To.Add("nedika.mungal@gmail.com");
        message.Subject = "hello world from Windows Azure!";
        message.HtmlBody = "<strong>Email Functionality </strong>" + msg;

        await resend.EmailSendAsync(message);
    }
}
