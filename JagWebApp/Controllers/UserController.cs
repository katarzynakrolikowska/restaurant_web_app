using System.Security.Claims;
using System.Threading.Tasks;
using JagWebApp.Core;
using JagWebApp.Core.Models;
using JagWebApp.Resources;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;

namespace JagWebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly ITokenRepository _tokenRepository;

        public UserController(
            UserManager<User> userManager, 
            ITokenRepository tokenRepository)
        {
            _userManager = userManager;
            _tokenRepository = tokenRepository;
        }

        //PATCH: api/user/email
        [HttpPatch("email")]
        public async Task<IActionResult> ChangeEmail([FromBody] JsonPatchDocument<User> patchUser)
        {
            var id = GetLoggedInUserId();
            if (id == null)
                return BadRequest();

            if (patchUser == null)
                return BadRequest();

            var userToModify = await _userManager.FindByIdAsync(id.ToString());

            patchUser.ApplyTo(userToModify, ModelState);
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _userManager.UpdateAsync(userToModify);

            if (result.Succeeded)
                return Ok(new { token = _tokenRepository.GenerateToken(userToModify).Result });

            return BadRequest(result.Errors);
        }

        //PUT: api/user/password
        [HttpPut("password")]
        public async Task<IActionResult> ChangePassword(ChangePasswordViewModelResource viewModel)
        {
            var id = GetLoggedInUserId();
            if (id == null)
                return BadRequest();

            var userToModify = await _userManager.FindByIdAsync(id.ToString());

            var result = await _userManager
                .ChangePasswordAsync(userToModify, viewModel.CurrentPassword, viewModel.NewPassword);

            if (result.Succeeded)
                return Ok();

            return BadRequest(result.Errors);
        }

        private int? GetLoggedInUserId()
        {
            return Core.Models.User.GetLoggedInUserId((ClaimsIdentity)User.Identity);
        }
    }
}