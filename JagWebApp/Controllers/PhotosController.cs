using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using JagWebApp.Core;
using JagWebApp.Core.Models.Helpers;
using JagWebApp.Core.Models.Identity;
using JagWebApp.Resources.DishResources;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace JagWebApp.Controllers
{
    [Authorize(Roles = Role.ADMIN)]
    [Route("api/dishes/{dishId}/[controller]")]
    [ApiController]
    public class PhotosController : ControllerBase
    {
        private readonly IDishRepository _dishRepository;
        private readonly IMapper _mapper;
        private readonly IPhotoRepository _photoRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly PhotoSettings _photoSettings;

        public PhotosController(
            IDishRepository dishRepository,
            IMapper mapper, 
            IPhotoRepository photoRepository,
            IUnitOfWork unitOfWork,
            IOptionsSnapshot<PhotoSettings> option
            )
        {
            _dishRepository = dishRepository;
            _mapper = mapper;
            _photoRepository = photoRepository;
            _unitOfWork = unitOfWork;
            _photoSettings = option.Value;
        }

        //GET: api/dishes/1/photos
        [HttpGet]
        public async Task<IActionResult> GetPhotosAsync(int dishId)
        {
            var dish = await _dishRepository.GetDishAsync(dishId);
            if (dish == null)
                return NotFound();

            var photos = await _photoRepository.GetPhotosAsync(dish);

            return Ok(_mapper.Map<IEnumerable<PhotoResource>>(photos));
        }

        //POST: api/dishes/1/photos
        [HttpPost]
        public async Task<IActionResult> UploadAsync(int dishId, IFormFile file)
        {
            var dish = await _dishRepository.GetDishAsync(dishId);
            if (dish == null)
                return NotFound();

            if (file == null || file.Length == 0) return BadRequest("Plik jest nieprawidłowy");
            if (file.Length > _photoSettings.MaxBytes) return BadRequest("Plik jest zbyt duży");
            if (!_photoSettings.IsSupported(file.FileName)) return BadRequest("Nieprawidłowy format pliku");

            var photo = _photoRepository.SavePhoto(dish, file);
            await _unitOfWork.CompleteAsync();

            return Ok(_mapper.Map<PhotoResource>(photo));
        }

        //PATCH: api/dishes/1/photos/1
        [HttpPatch("{photoId}")]
        public async Task<IActionResult> UpdateMainPhotoAsync(int dishId, int photoId)
        {
            var lastMainPhotoId = 0;
            var photo = await _photoRepository.GetPhotoAsync(photoId);
            if (photo == null)
                return NotFound();

            if (dishId != photo.DishId)
                return BadRequest();

            if (!photo.IsMain)
            {
                var lastMainPhoto = await _photoRepository.GetLastMainPhotoAsync(dishId);
                if (lastMainPhoto != null)
                {
                    lastMainPhoto.IsMain = false;
                    lastMainPhotoId = lastMainPhoto.Id;
                }
            }

            photo.IsMain = !photo.IsMain;
            await _unitOfWork.CompleteAsync();

            return Ok(lastMainPhotoId);
        }


        //DELETE: api/dishes/1/photos/1
        [HttpDelete("{photoId}")]
        public async Task<IActionResult> RemoveAsync(int dishId, int photoId)
        {
            var photo = await _photoRepository.GetPhotoAsync(photoId);
            if (photo == null)
                return NotFound();

            if (dishId != photo.DishId)
                return BadRequest();

            _photoRepository.Remove(photo);
            await _unitOfWork.CompleteAsync();

            return Ok();
        }
    }
}