using System.Collections.Generic;
using System.Threading.Tasks;
using JagWebApp.Core.Models;
using Microsoft.AspNetCore.Http;

namespace JagWebApp.Core
{
    public interface IPhotoRepository
    {
        Task<IEnumerable<Photo>> GetPhotosAsync(Dish dish);

        Task<Photo> GetPhotoAsync(int photoId);

        Task<Photo> GetLastMainPhotoAsync(int dishId);

        Photo SavePhoto(Dish dish, IFormFile file);

        void Remove(Photo photo);

        void Remove(IEnumerable<Photo> photos);
    }
}