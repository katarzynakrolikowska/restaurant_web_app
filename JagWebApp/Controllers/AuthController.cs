using System.Threading.Tasks;
using AutoMapper;
using JagWebApp.Core;
using JagWebApp.Core.Models.Identity;
using JagWebApp.Resources.UserResources;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace JagWebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class AuthController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly ITokenRepository _tokenRepository;

        public AuthController(IMapper mapper, UserManager<User> userManager, SignInManager<User> signInManager, 
            ITokenRepository tokenRepository)
        {
            _mapper = mapper;
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenRepository = tokenRepository;
        }

        //POST: api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> RegisterAsync(UserForRegisterResource userForRegisterResource)
        {
            var userToRegister = _mapper.Map<User>(userForRegisterResource);

            var result = await _userManager.CreateAsync(userToRegister, userForRegisterResource.Password);

            if (result.Succeeded)
            {
                return Ok();
            }

            return BadRequest(result.Errors);
        }

        //POST: api/auth/login
        [HttpPost("login")]

        public async Task<IActionResult> LoginAsync(UserForLoginResource userForLoginResource)
        {
            var user = await _userManager.FindByEmailAsync(userForLoginResource.Email);
            if (user == null)
                return Unauthorized();

            var result = await _signInManager.CheckPasswordSignInAsync(user, userForLoginResource.Password, false);

            if (result.Succeeded)
            {
                return Ok(new
                {
                    token = _tokenRepository.GenerateTokenAsync(user).Result
                });
            }

            return Unauthorized();
        }

        //GET: api/auth/a@abc.com
        [HttpGet("{email}")]
        public async Task<IActionResult> UserExistsAsync(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);

            return Ok(user != null);
        }
    }
}
// https://myopswork.com/how-remove-files-completely-from-git-repository-history-47ed3e0c4c35