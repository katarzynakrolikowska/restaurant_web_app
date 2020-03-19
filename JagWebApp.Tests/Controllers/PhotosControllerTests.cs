using AutoMapper;
using JagWebApp.Controllers;
using JagWebApp.Core;
using JagWebApp.Core.Models;
using JagWebApp.Core.Models.Helpers;
using JagWebApp.Resources;
using JagWebApp.Tests.Mocks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace JagWebApp.Tests.Controllers
{
    public class PhotosControllerTests
    {
        private readonly PhotosController _controller;

        private readonly Mock<IFormFile> _file;
        private readonly PhotoSettings _settings;

        private readonly DishRepositoryMock _dishRepositoryMock;
        private readonly PhotoRepositoryMock _photoRepositoryMock;
        private readonly UnitOfWorkMock _unitOfWorkMock;

        public PhotosControllerTests()
        {
            var dishRepo = new Mock<IDishRepository>();
            var photoRepo = new Mock<IPhotoRepository>();
            var unitOfWork = new Mock<IUnitOfWork>();

            var options = new Mock<IOptionsSnapshot<PhotoSettings>>();
            _settings = new PhotoSettings();
            options.Setup(o => o.Value).Returns(_settings);

            var mapper = new MapperConfiguration(mc => mc.AddProfile(new MappingProfile())).CreateMapper();

            _controller = new PhotosController(dishRepo.Object, mapper, photoRepo.Object, unitOfWork.Object, options.Object);

            _file = new Mock<IFormFile>();

            _photoRepositoryMock = new PhotoRepositoryMock(photoRepo);
            _dishRepositoryMock = new DishRepositoryMock(dishRepo);
            _unitOfWorkMock = new UnitOfWorkMock(unitOfWork);
        }

        [Fact]
        public void GetPhotos_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.GetPhotos(It.IsAny<int>());

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public async void GetPhotos_WhenDishDoesNotExist_ReturnsNotFoundResult()
        {
            Dish dish = null;
            _dishRepositoryMock.MockGetDish(dish);

            var result = await _controller.GetPhotos(It.IsAny<int>()) as NotFoundResult;

            Assert.Equal(404, result.StatusCode);
        }

        [Fact]
        public async void GetPhotos_WhenDishExists_GetPhotosFromRepoIsCalled()
        {
            var dish = new Dish();
            _dishRepositoryMock.MockGetDish(dish);
            _photoRepositoryMock.MockGetPhotos(dish, new List<Photo>());

            await _controller.GetPhotos(It.IsAny<int>());

            _photoRepositoryMock.VerifyGetPhotos(dish);
        }

        [Fact]
        public async void GetPhotos_WhenDishExists_ReturnsOkObjectResult()
        {
            var photos = new List<Photo>() { new Photo() };
            _dishRepositoryMock.MockGetDish(new Dish());
            _photoRepositoryMock.MockGetPhotos(photos);

            var result = await _controller.GetPhotos(It.IsAny<int>()) as OkObjectResult;
            var values = result.Value as List<PhotoResource>;

            Assert.Equal(200, result.StatusCode);
            Assert.Single(values);
        }

        [Fact]
        public void Upload_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.Upload(It.IsAny<int>(), It.IsAny<IFormFile>());

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public async void Upload_WhenDishDoesNotExist_ReturnsNotFoundResult()
        {
            Dish dish = null;
            _dishRepositoryMock.MockGetDish(dish);

            var result = await _controller.Upload(It.IsAny<int>(), It.IsAny<IFormFile>()) as NotFoundResult;

            Assert.Equal(404, result.StatusCode);
        }

        [Fact]
        public async void Upload_WhenFileIsNull_ReturnsBadRequestObjectResult()
        {
            _dishRepositoryMock.MockGetDish(new Dish());

            var result = await _controller.Upload(It.IsAny<int>(), null) as BadRequestObjectResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void Upload_WhenFileIsEmpty_ReturnsBadRequestObjectResult()
        {
            _file.Setup(mf => mf.Length).Returns(0);
            _dishRepositoryMock.MockGetDish(new Dish());

            var result = await _controller.Upload(It.IsAny<int>(), _file.Object) as BadRequestObjectResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void Upload_WhenFileIsTooBig_ReturnsBadRequestObjectResult()
        {
            _dishRepositoryMock.MockGetDish(new Dish());
            _file.Setup(f => f.Length).Returns(2);
            _settings.MaxBytes = 1;

            var result = await _controller.Upload(It.IsAny<int>(), _file.Object) as BadRequestObjectResult;

            Assert.Equal(400, result.StatusCode);
            
        }

        [Fact]
        public async void Upload_WhenFileExtensionIsInvalid_ReturnsBadRequestObjectResult()
        {
            _dishRepositoryMock.MockGetDish(new Dish());
            _file.Setup(f => f.Length).Returns(1);
            _file.Setup(f => f.FileName).Returns("z.b");
            _settings.MaxBytes = 2;
            _settings.AcceptedFileTypes = new string[] { ".a" };

            var result = await _controller.Upload(It.IsAny<int>(), _file.Object) as BadRequestObjectResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void Upload_WhenFileIsValid_SavePhotoIsCalled()
        {
            var dish = new Dish();
            _dishRepositoryMock.MockGetDish(dish);
            SetUpValidFile();

            await _controller.Upload(It.IsAny<int>(), _file.Object);

            _photoRepositoryMock.VerifySavePhoto(dish, _file);
        }

        [Fact]
        public async void Upload_WhenFileIsValid_ReturnsOkObjectResult()
        {
            var dish = new Dish();
            _dishRepositoryMock.MockGetDish(dish);
            SetUpValidFile();

            var result = await _controller.Upload(It.IsAny<int>(), _file.Object) as OkObjectResult;

            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public void UpdateMainPhoto_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.UpdateMainPhoto(It.IsAny<int>(), It.IsAny<int>());

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public async void UpdateMainPhoto_WhenPhotoDoesNotExist_ReturnsNotFoundResult()
        {
            Photo photo = null;
            _photoRepositoryMock.MockGetPhoto(photo);

            var result = await _controller.UpdateMainPhoto(It.IsAny<int>(), It.IsAny<int>()) as NotFoundResult;

            Assert.Equal(404, result.StatusCode);
        }

        [Fact]
        public async void UpdateMainPhoto_WhenPhotoIdAnDishIdAreNotEqual_ReturnsBadRequestResult()
        {
            var photo = new Photo() { Id = 1 };
            _photoRepositoryMock.MockGetPhoto(photo);

            var result = await _controller.UpdateMainPhoto(2, It.IsAny<int>()) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void UpdateMainPhoto_WhenPhotoIsNotMainPhotoAndDishHasMainPhoto_LastMainPhotoIsUpdated()
        {
            var lastMainPhoto = new Photo() { Id = 1, IsMain = true };
            var photo = new Photo() { IsMain = false };
            _photoRepositoryMock.MockGetPhoto(photo);
            _photoRepositoryMock.MockGetLastMainPhoto(lastMainPhoto);

            await _controller.UpdateMainPhoto(It.IsAny<int>(), It.IsAny<int>());

            _photoRepositoryMock.VerifyGetLastMainPhoto();
            Assert.False(lastMainPhoto.IsMain);
        }

        [Fact]
        public async void UpdateMainPhoto_WhenPhotoIsMainPhoto_ReturnsOkObjectResult()
        {
            var photo = new Photo() { IsMain = true };
            _photoRepositoryMock.MockGetPhoto(photo);

            var result = await _controller.UpdateMainPhoto(It.IsAny<int>(), It.IsAny<int>()) as OkObjectResult;
            var value = result.Value;

            Assert.False(photo.IsMain);
            Assert.Equal(200, result.StatusCode);
            Assert.Equal(0, value);
        }

        [Fact]
        public void Remove_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.Remove(It.IsAny<int>(), It.IsAny<int>());

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public async void Remove_WhenPhotoDoesNotExist_ReturnsNotFoundResult()
        {
            Photo photo = null;
            _photoRepositoryMock.MockGetPhoto(photo);

            var result = await _controller.Remove(It.IsAny<int>(), It.IsAny<int>()) as NotFoundResult;

            Assert.Equal(404, result.StatusCode);
        }

        [Fact]
        public async void Remove_WhenPhotoIdAnDishIdAreNotEqual_ReturnsBadRequestResult()
        {
            var photo = new Photo() { Id = 1 };
            _photoRepositoryMock.MockGetPhoto(photo);

            var result = await _controller.Remove(2, It.IsAny<int>()) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void Remove_WhenPhotoIsValid_PhotoIsRemoved()
        {
            var photo = new Photo();
            _photoRepositoryMock.MockGetPhoto(photo);
            _unitOfWorkMock.MockCompleteAsync();

            await _controller.Remove(It.IsAny<int>(), It.IsAny<int>());

            _photoRepositoryMock.VerifyRemove(photo);
            _unitOfWorkMock.VerifyCompleteAsync();
        }

        [Fact]
        public async void Remove_WhenPhotoIsValid_ReturnsOkResult()
        {
            _photoRepositoryMock.MockGetPhoto(new Photo());

            var result = await _controller.Remove(It.IsAny<int>(), It.IsAny<int>()) as OkResult;

            Assert.Equal(200, result.StatusCode);
        }

        private void SetUpValidFile()
        {
            _file.Setup(f => f.Length).Returns(1);
            _file.Setup(f => f.FileName).Returns("z.a");
            _settings.MaxBytes = 2;
            _settings.AcceptedFileTypes = new string[] { ".a" };
        }
    }
}
