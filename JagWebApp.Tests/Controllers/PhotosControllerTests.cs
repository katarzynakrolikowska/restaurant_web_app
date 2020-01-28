using AutoMapper;
using JagWebApp.Controllers;
using JagWebApp.Core;
using JagWebApp.Core.Models;
using JagWebApp.Resources;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Moq;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace JagWebApp.Tests.Controllers
{
    public class PhotosControllerTests
    {
        private readonly Mock<IDishRepository> _dishRepo;
        private readonly Mock<IPhotoRepository> _photoRepo;
        private readonly Mock<IOptionsSnapshot<PhotoSettings>> _options;
        private readonly IMapper _mapper;
        private readonly Mock<IUnitOfWork> _unitOfWork;
        private readonly PhotosController _controller;
        private readonly Mock<IFormFile> _file;
        private readonly PhotoSettings _settings;

        public PhotosControllerTests()
        {
            _dishRepo = new Mock<IDishRepository>();
            _photoRepo = new Mock<IPhotoRepository>();
            _options = new Mock<IOptionsSnapshot<PhotoSettings>>();
            _settings = new PhotoSettings();
            _options.Setup(o => o.Value)
                .Returns(_settings);
            _mapper = new MapperConfiguration(mc => mc.AddProfile(new MappingProfile())).CreateMapper();
            _unitOfWork = new Mock<IUnitOfWork>();
            _controller = new PhotosController(
                _dishRepo.Object,
                _mapper,
                _photoRepo.Object,
                _unitOfWork.Object,
                _options.Object
                );
            _file = new Mock<IFormFile>();
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
            MockDishRepo(dish);

            var result = await _controller.GetPhotos(It.IsAny<int>()) as NotFoundResult;

            Assert.Equal(404, result.StatusCode);
        }

        [Fact]
        public async void GetPhotos_WhenDishExists_GetPhotosFromRepoIsCalled()
        {
            var dish = new Dish();
            MockDishRepo(dish);
            _photoRepo.Setup(pr => pr.GetPhotos(dish))
                .ReturnsAsync(new List<Photo>());

            await _controller.GetPhotos(It.IsAny<int>());

            _photoRepo.Verify(pr => pr.GetPhotos(dish));
        }

        [Fact]
        public async void GetPhotos_WhenDishExists_ReturnsOkObjectResult()
        {
            var photos = new List<Photo>() { new Photo() };
            MockDishRepo(new Dish());
            _photoRepo.Setup(pr => pr.GetPhotos(It.IsAny<Dish>()))
                .ReturnsAsync(photos);

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
            MockDishRepo(dish);

            var result = await _controller.Upload(It.IsAny<int>(), It.IsAny<IFormFile>()) as NotFoundResult;

            Assert.Equal(404, result.StatusCode);
        }

        [Fact]
        public async void Upload_WhenFileIsNull_ReturnsBadRequestObjectResult()
        {
            MockDishRepo(new Dish());

            var result = await _controller.Upload(It.IsAny<int>(), null) as BadRequestObjectResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void Upload_WhenFileIsEmpty_ReturnsBadRequestObjectResult()
        {
            _file.Setup(mf => mf.Length).Returns(0);
            MockDishRepo(new Dish());

            var result = await _controller.Upload(It.IsAny<int>(), _file.Object) as BadRequestObjectResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void Upload_WhenFileIsTooBig_ReturnsBadRequestObjectResult()
        {
            MockDishRepo(new Dish());
            _file.Setup(f => f.Length).Returns(2);
            _settings.MaxBytes = 1;

            var result = await _controller.Upload(It.IsAny<int>(), _file.Object) as BadRequestObjectResult;

            Assert.Equal(400, result.StatusCode);
            
        }

        [Fact]
        public async void Upload_WhenFileExtensionIsInvalid_ReturnsBadRequestObjectResult()
        {
            MockDishRepo(new Dish());
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
            MockDishRepo(dish);
            SetUpValidFile();

            await _controller.Upload(It.IsAny<int>(), _file.Object);

            _photoRepo.Verify(pr => pr.SavePhoto(dish, _file.Object));
        }

        [Fact]
        public async void Upload_WhenFileIsValid_ReturnsOkObjectResult()
        {
            var dish = new Dish();
            MockDishRepo(dish);
            SetUpValidFile();

            var result = await _controller.Upload(It.IsAny<int>(), _file.Object) as OkObjectResult;

            Assert.Equal(200, result.StatusCode);
        }

        private void SetUpValidFile()
        {
            _file.Setup(f => f.Length).Returns(1);
            _file.Setup(f => f.FileName).Returns("z.a");
            _settings.MaxBytes = 2;
            _settings.AcceptedFileTypes = new string[] { ".a" };
        }

        private void MockDishRepo(Dish dishToReturn)
        {
            _dishRepo.Setup(dr => dr.GetDish(It.IsAny<int>()))
                .ReturnsAsync(dishToReturn);
        }
    }
}
