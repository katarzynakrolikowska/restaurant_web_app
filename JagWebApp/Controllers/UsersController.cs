﻿using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using JagWebApp.Core;
using JagWebApp.Core.Models.Identity;
using JagWebApp.Resources.UserResources;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;

namespace JagWebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly ITokenRepository _tokenRepository;
        private readonly IAddressRepository _addressRepsitory;
        private readonly IUserRepository _userRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public UsersController(
            UserManager<User> userManager, 
            ITokenRepository tokenRepository, 
            IAddressRepository addressRepsitory,
            IUserRepository userRepository,
            IUnitOfWork unitOfWork,
            IMapper mapper)
        {
            _userManager = userManager;
            _tokenRepository = tokenRepository;
            _addressRepsitory = addressRepsitory;
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        //GET: api/users
        [HttpGet]
        public async Task<IActionResult> GetUserAsync()
        {
            var id = GetLoggedInUserId();

            var user = await _userRepository.GetUserAsync((int)id);
            
            return Ok(_mapper.Map<UserCustomerResource>(user));
        }

        //PATCH: api/users
        [HttpPatch]
        public async Task<IActionResult> UpdateAsync([FromBody] JsonPatchDocument<UpdateUserResource> patchUser)
        {
            var id = GetLoggedInUserId();

            if (patchUser == null)
                return BadRequest();

            var userToModify = await _userManager.FindByIdAsync(id.ToString());
            var updateUserResource = _mapper.Map<UpdateUserResource>(userToModify);

            if (patchUser.Operations[0].path != "/Email" && await _userManager.IsInRoleAsync(userToModify, Role.ADMIN))
                return BadRequest();

            var addressId = userToModify.AddressId;

            patchUser.ApplyTo(updateUserResource, ModelState);

            var isValid = TryValidateModel(updateUserResource);
            if (!isValid)
                return BadRequest(ModelState);

            _mapper.Map(updateUserResource, userToModify);
            var result = await _userManager.UpdateAsync(userToModify);

            if (result.Succeeded && patchUser.Operations[0].path == "/Email")
                return Ok(new { token = _tokenRepository.GenerateTokenAsync(userToModify).Result });
            else if (result.Succeeded)
            {
                await _addressRepsitory.RemoveAsync(addressId);
                await _unitOfWork.CompleteAsync();
                return Ok();
            }

            return BadRequest(result.Errors);
        }

        //PUT: api/users/password
        [HttpPut("password")]
        public async Task<IActionResult> ChangePasswordAsync(ChangePasswordViewModelResource viewModel)
        {
            var id = GetLoggedInUserId();

            var userToModify = await _userManager.FindByIdAsync(id.ToString());

            var result = await _userManager
                .ChangePasswordAsync(userToModify, viewModel.CurrentPassword, viewModel.NewPassword);

            if (result.Succeeded)
                return Ok();

            return BadRequest(result.Errors);
        }

        private int? GetLoggedInUserId()
        {
            return Core.Models.Identity.User.GetLoggedInUserId((ClaimsIdentity)User.Identity);
        }
    }
}