using JagWebApp.Core;
using JagWebApp.Core.Models;
using JagWebApp.Core.Models.Helpers;
using JagWebApp.Persistance;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JagWebApp.Persistence
{
    public class PhotoRepository : IPhotoRepository
    {
        public const string ROOT_NAME = "uploads";

        private readonly JagDbContext _context;
        private readonly IFileService _fileService;

        public PhotoRepository(JagDbContext context, IFileService fileService)
        {
            _context = context;
            _fileService = fileService;
        }

        public async Task<IEnumerable<Photo>> GetPhotos(Dish dish)
        {
            return await _context.Photos
                .Where(p => p.DishId == dish.Id)
                .ToListAsync();
        }

        public async Task<Photo> GetPhoto(int photoId)
        {
            return await _context.Photos
                .SingleOrDefaultAsync(p => p.Id == photoId);
        }

        public async Task<Photo> GetLastMainPhoto(int dishId)
        {
            return await _context.Photos
                .SingleOrDefaultAsync(p => p.DishId == dishId && p.IsMain == true);
        }

        public async Task<Photo> SavePhoto(Dish dish, IFormFile file)
        {
            var dimensions = new ImageDimensions() { Height = 125, Width = 125 };
            var fileName = await _fileService.SaveFile(file, ROOT_NAME); 
            var thumbnailName = await _fileService.SaveFile(file, ROOT_NAME, dimensions); 

            var photo = new Photo { Name = fileName, ThumbnailName = thumbnailName };
            dish.Photos.Add(photo);

            return photo;
        }

        public void Remove(Photo photo)
        {
            _context.Photos.Remove(photo);
            _fileService.RemoveFile(photo.Name, ROOT_NAME);
            _fileService.RemoveFile(photo.ThumbnailName, ROOT_NAME);
        }
    }
}
