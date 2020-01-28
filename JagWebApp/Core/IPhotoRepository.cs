using System.Collections.Generic;
using System.Threading.Tasks;
using JagWebApp.Core.Models;
using Microsoft.AspNetCore.Http;

namespace JagWebApp.Core
{
    public interface IPhotoRepository
    {
        Task<IEnumerable<Photo>> GetPhotos(Dish dish);

        Task<Photo> GetPhoto(int photoId);

        Task<Photo> SavePhoto(Dish dish, IFormFile file);

        void Remove(Photo photo);
    }
}