using System.Threading.Tasks;
using AutoMapper;
using JagWebApp.Core;
using JagWebApp.Core.Models;
using JagWebApp.Resources;
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
        public async Task<IActionResult> Register(UserForRegisterResource userForRegisterResource)
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

        public async Task<IActionResult> Login(UserForLoginResource userForLoginResource)
        {
            var user = await _userManager.FindByEmailAsync(userForLoginResource.Email);
            if (user == null)
                return Unauthorized();

            var result = await _signInManager.CheckPasswordSignInAsync(user, userForLoginResource.Password, false);

            if (result.Succeeded)
            {
                return Ok(new
                {
                    token = _tokenRepository.GenerateToken(user).Result
                });
            }

            return Unauthorized();
        }

        //GET: api/auth/a@abc.com
        [HttpGet("{email}")]
        public async Task<IActionResult> UserExists(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);

            var result = user != null ? true : false;

            return Ok(result);
        }
    }
}