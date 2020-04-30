using JagWebApp.Core;
using JagWebApp.Core.Models;
using Microsoft.AspNetCore.Http;
using Moq;
using System.Collections.Generic;

namespace JagWebApp.Tests.Mocks
{
    class PhotoRepositoryMock
    {
        private Mock<IPhotoRepository> _photoRepo = new Mock<IPhotoRepository>();

        public PhotoRepositoryMock(Mock<IPhotoRepository> photoRepo)
        {
            _photoRepo = photoRepo;
        }

        public void MockGetPhotos(Dish dish, ICollection<Photo> photos)
        {
            _photoRepo.Setup(pr => pr.GetPhotosAsync(dish))
                .ReturnsAsync(photos);
        }

        public void MockGetPhotos(ICollection<Photo> photos)
        {
            _photoRepo.Setup(pr => pr.GetPhotosAsync(It.IsAny<Dish>()))
                .ReturnsAsync(photos);
        }

        public void MockRemove(ICollection<Photo> photos)
        {
            _photoRepo.Setup(pr => pr.Remove(photos));
        }

        public void MockGetPhoto(Photo photo)
        {
            _photoRepo.Setup(pr => pr.GetPhotoAsync(It.IsAny<int>()))
                .ReturnsAsync(photo);
        }

        public void MockGetLastMainPhoto(Photo photo)
        {
            _photoRepo.Setup(pr => pr.GetLastMainPhotoAsync(It.IsAny<int>()))
                .ReturnsAsync(photo);
        }

        public void VerifyGetPhotos(Dish dish)
        {
            _photoRepo.Verify(pr => pr.GetPhotosAsync(dish));
        }

        public void VerifySavePhoto(Dish dish, Mock<IFormFile> file)
        {
            _photoRepo.Verify(pr => pr.SavePhoto(dish, file.Object));
        }

        public void VerifyRemove(ICollection<Photo> photos)
        {
            _photoRepo.Verify(pr => pr.Remove(photos));
        }

        public void VerifyRemove(Photo photo)
        {
            _photoRepo.Verify(pr => pr.Remove(photo));
        }

        public void VerifyGetLastMainPhoto()
        {
            _photoRepo.Verify(pr => pr.GetLastMainPhotoAsync(It.IsAny<int>()));
        }
    }
}
