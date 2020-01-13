using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using JagWebApp.Core.Models;
using JagWebApp.Core.Models.Authorization;
using JagWebApp.Resources;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace JagWebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _configuration;

        public UserController(UserManager<User> userManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _configuration = configuration;
        }

        [HttpPost("email/{id}")]
        public async Task<IActionResult> ChangeEmail(int id, UserForLoginResource userForLoginResource)
        {
            var userToModify = await _userManager.FindByIdAsync(id.ToString());
            if (userToModify == null)
                return NotFound("Nie znaleziono użytkownika");

            var loggedInUserId = ((ClaimsIdentity)User.Identity).FindFirst(ClaimTypes.NameIdentifier).Value;
            if (id != int.Parse(loggedInUserId))
                return Unauthorized("Brak uprawnień");


            await _userManager.SetEmailAsync(userToModify, userForLoginResource.Email);
            await _userManager.SetUserNameAsync(userToModify, userForLoginResource.Email);

            var result = await _userManager.UpdateAsync(userToModify);
            if (result.Succeeded)
            {
                var tokenManager = new TokenManager(_configuration, _userManager);
                return Ok(new
                {
                    token = tokenManager.GenerateToken(userToModify).Result
                });
            }

            return BadRequest(result.Errors);
        }

        
    }
}