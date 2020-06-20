using JagWebApp.Core;
using JagWebApp.Core.Models;
using JagWebApp.Core.Models.Helpers;
using JagWebApp.Persistance;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JagWebApp.Persistence
{
    public class PhotoRepository : IPhotoRepository
    {
        private const string ROOT_NAME = "uploads";

        private readonly JagDbContext _context;
        private readonly IFileService _fileService;

        public PhotoRepository(JagDbContext context, IFileService fileService)
        {
            _context = context;
            _fileService = fileService;
        }

        public async Task<IEnumerable<Photo>> GetPhotosAsync(Dish dish)
        {
            return await _context.Photos
                .Where(p => p.DishId == dish.Id)
                .ToListAsync();
        }

        public async Task<Photo> GetPhotoAsync(int photoId)
        {
            return await _context.Photos
                .SingleOrDefaultAsync(p => p.Id == photoId);
        }

        public async Task<Photo> GetLastMainPhotoAsync(int dishId)
        {
            return await _context.Photos
                .SingleOrDefaultAsync(p => p.DishId == dishId && p.IsMain == true);
        }

        public Photo SavePhoto(Dish dish, IFormFile file)
        {
            var thumbnailName = _fileService.SaveFile(file, ROOT_NAME);

            var photo = new Photo
            {
                ThumbnailName = thumbnailName,
                IsMain = dish.Photos.Count == 0
            };
            dish.Photos.Add(photo);

            return photo;
        }

        public void Remove(Photo photo)
        {
            _context.Photos.Remove(photo);
            _fileService.RemoveFile(photo.ThumbnailName, ROOT_NAME);
        }

        public void Remove(IEnumerable<Photo> photos)
        {
            photos.ToList().ForEach(p =>
            {
                _fileService.RemoveFile(p.ThumbnailName, ROOT_NAME);
            });
        }
    }
}
