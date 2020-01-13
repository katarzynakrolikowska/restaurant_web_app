using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using JagWebApp.Core.Models;
using JagWebApp.Core.Models.Authorization;
using JagWebApp.Resources;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace JagWebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly RoleManager<Role> _roleManager;

        public AuthController(IConfiguration configuration, IMapper mapper,
            UserManager<User> userManager, SignInManager<User> signInManager, RoleManager<Role> roleManager)
        {
            _configuration = configuration;
            _mapper = mapper;
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
        }


        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register(UserForRegisterResource userForRegisterResource)
        {
            var userToRegister = _mapper.Map<User>(userForRegisterResource);

            var result = await _userManager.CreateAsync(userToRegister, userForRegisterResource.Password);


            if (result.Succeeded)
            {
                return StatusCode(201);
            }

            return BadRequest(result.Errors);
        }


        [HttpPost("login")]
        [AllowAnonymous]

        public async Task<IActionResult> Login(UserForLoginResource userForLoginResource)
        {
            var user = await _userManager.FindByEmailAsync(userForLoginResource.Email);

            var result = await _signInManager.CheckPasswordSignInAsync(user, userForLoginResource.Password, false);

            if (result.Succeeded)
            {
                var tokenManager = new TokenManager(_configuration, _userManager);
                return Ok(new
                {
                    token = tokenManager.GenerateToken(user).Result
                });
            }

            return Unauthorized();
        }

        [HttpGet("{email}")]
        [AllowAnonymous]
        public async Task<IActionResult> UserExists(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);

            var result = user != null ? true : false;

            return Ok(result);
        }



        
    }

}