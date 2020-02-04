using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using JagWebApp.Core;
using JagWebApp.Core.Models;
using JagWebApp.Resources;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace JagWebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly ITokenRepository _tokenRepository;

        public UserController(UserManager<User> userManager, ITokenRepository tokenRepository)
        {
            _userManager = userManager;
            _tokenRepository = tokenRepository;
        }

        //POST: api/user/email/1
        [HttpPost("email/{id}")]
        public async Task<IActionResult> ChangeEmail(int id, UserForLoginResource userForLoginResource)
        {
            var userToModify = await _userManager.FindByIdAsync(id.ToString());

            if (userToModify == null)
                return NotFound("Nie znaleziono użytkownika");

            if (id != GetLoggedInUserId())
                return Unauthorized("Brak uprawnień");


            await _userManager.SetEmailAsync(userToModify, userForLoginResource.Email);
            await _userManager.SetUserNameAsync(userToModify, userForLoginResource.Email);

            var result = await _userManager.UpdateAsync(userToModify);

            if (result.Succeeded)
            {
                return Ok(new
                {
                    token = _tokenRepository.GenerateToken(userToModify).Result
                });
            }

            return BadRequest(result.Errors);
        }

        //POST: api/user/password/1
        [HttpPost("password/{id}")]
        public async Task<IActionResult> ChangePassword(int id, ChangePasswordViewModelResource viewModel)
        {
            var userToModify = await _userManager.FindByIdAsync(id.ToString());
            if (userToModify == null)
                return NotFound("Nie znaleziono użytkownika");

            if (id != GetLoggedInUserId())
                return Unauthorized("Brak uprawnień");

            var result = await _userManager
                .ChangePasswordAsync(userToModify, viewModel.CurrentPassword, viewModel.NewPassword);

            if (result.Succeeded)
                return Ok();

            return BadRequest(result.Errors);
        }

        public int GetLoggedInUserId()
        {
            var id = ((ClaimsIdentity)User.Identity).FindFirst(ClaimTypes.NameIdentifier).Value;
            return int.Parse(id);
        }
    }
}