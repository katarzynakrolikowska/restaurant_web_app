using AutoMapper;
using JagWebApp.Controllers;
using JagWebApp.Core;
using JagWebApp.Core.Models;
using JagWebApp.Resources;
using JagWebApp.Tests.Mocks;
using JagWebApp.Tests.Stubs;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace JagWebApp.Tests.Controllers
{
    public class MenuControllerTests
    {
        private readonly MenuController _controller;

        private readonly DishRepositoryMock _dishRepositoryMock;
        private readonly MenuRepositoryMock _menuRepositoryMock;
        private readonly UnitOfWorkMock _unitOfWorkMock;

        public MenuControllerTests()
        {
            var menuRepo = new Mock<IMenuRepository>();
            var dishRepo = new Mock<IDishRepository>();
            var unitOfWork = new Mock<IUnitOfWork>();
            var mapper = new MapperConfiguration(mc => mc.AddProfile(new MappingProfile())).CreateMapper();
            var hub = HubContextMock.Hub;

            _controller = new MenuController(menuRepo.Object, dishRepo.Object, unitOfWork.Object, mapper, hub.Object);

            _dishRepositoryMock = new DishRepositoryMock(dishRepo);
            _menuRepositoryMock = new MenuRepositoryMock(menuRepo);
            _unitOfWorkMock = new UnitOfWorkMock(unitOfWork);
        }

        [Fact]
        public void GetMenu_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.GetMenu();

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public async void GetMenu_WhenCalled_GetMenuItemsFromRepoIsCalled()
        {
            _menuRepositoryMock.MockGetMenuItems(new List<MenuItem>());

            await _controller.GetMenu();

            _menuRepositoryMock.VerifyGetMenuItems();
        }

        [Fact]
        public async void GetMenu_WhenCalled_ReturnsOkObjectResultWithMenuItems()
        {
            var menuItems = new List<MenuItem>() { new MenuItem(), new MenuItem() };
            _menuRepositoryMock.MockGetMenuItems(menuItems);

            var result = await _controller.GetMenu() as OkObjectResult;
            var values = result.Value as List<MenuItemResource>;

            Assert.Equal(200, result.StatusCode);
            Assert.Equal(2, values.Count);
        }

        [Fact]
        public void Create_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.Create(It.IsAny<SaveMenuItemResource>());

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public async void Create_WhenSaveMenuItemIsMainItemAndMainMenuItemExsist_ReturnsBadRequestObjectResult()
        {
            var saveMenuItem = new SaveMenuItemResource { IsMain = true };
            _menuRepositoryMock.MockGetMainMenuItem(new MenuItem());

            var result = await _controller.Create(saveMenuItem) as BadRequestObjectResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void Create_WhenDishesNotExist_ReturnsBadRequestObjectResult()
        {
            _dishRepositoryMock.MockDishesExist(false);

            var result = await _controller.Create(new SaveMenuItemResource()) as BadRequestObjectResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void Create_WhenDishExistsAndModelIsValid_MenuItemIsSaved()
        {
            _dishRepositoryMock.MockDishesExist(true);
            _menuRepositoryMock.MockAdd();

            await _controller.Create(new SaveMenuItemResource());

            _menuRepositoryMock.VerifyAdd();
        }

        [Fact]
        public async void Create_WhenDishExistsAndModelIsValid_ReturnsOkResult()
        {
            _dishRepositoryMock.MockDishesExist(true);
            _menuRepositoryMock.MockAdd();

            var result = await _controller.Create(new SaveMenuItemResource()) as OkResult;

            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public void UpdateMenuItem_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.UpdateMenuItem(It.IsAny<int>(), It.IsAny<UpdateMenuItemResource>());

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public async void UpdateMenuItem_WhenMenuItemDoesNotExist_ReturnsNotFoundResult()
        {
            MenuItem item = null;
            _menuRepositoryMock.MockGetMenuItem(item);

            var result = await _controller
                .UpdateMenuItem(It.IsAny<int>(), It.IsAny<UpdateMenuItemResource>()) as NotFoundResult;

            Assert.Equal(404, result.StatusCode);
        }

        [Fact]
        public async void UpdateMenuItem_WhenMenuItemExists_ItemIsUpdated()
        {
            var item = MenuItemStub.GetMenuItem();
            var updateItem = UpdateMenuItemStub.GetUpdateMenuItem();
            _menuRepositoryMock.MockGetMenuItem(item);
            _unitOfWorkMock.MockCompleteAsync();
            HubContextMock.MockHub();

            await _controller.UpdateMenuItem(1, updateItem);

            _unitOfWorkMock.VerifyCompleteAsync();
            Assert.Equal(1, item.Dishes.Count);
            Assert.Equal(2, item.Price);
            Assert.Equal(2, item.Available);
            Assert.Equal(2, item.Limit);
        }

        [Fact]
        public async void UpdateMenuItem_WhenMenuItemExists_ReturnsOkResult()
        {
            _menuRepositoryMock.MockGetMenuItem(new MenuItem());
            HubContextMock.MockHub();

            var result = await _controller.UpdateMenuItem(It.IsAny<int>(), new UpdateMenuItemResource()) as OkResult;

            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public void Remove_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.Remove(It.IsAny<int>());

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public async void Remove_WhenMenuItemDoesNotExist_ReturnsNotFoundResult()
        {
            MenuItem item = null;
            _menuRepositoryMock.MockGetMenuItem(item);

            var result = await _controller.Remove(It.IsAny<int>()) as NotFoundResult;

            Assert.Equal(404, result.StatusCode);
        }

        [Fact]
        public async void Remove_WhenMenuItemExists_ItemIsRemoved()
        {
            var item = new MenuItem();
            _menuRepositoryMock.MockGetMenuItem(item);
            _menuRepositoryMock.MockRemove();
            _unitOfWorkMock.MockCompleteAsync();
            HubContextMock.MockHub();

            await _controller.Remove(It.IsAny<int>());

            _menuRepositoryMock.VerifyRemove(item);
            _unitOfWorkMock.VerifyCompleteAsync();
        }

        [Fact]
        public async void Remove_WhenMenuItemExists_ReturnsOkResult()
        {
            _menuRepositoryMock.MockGetMenuItem(new MenuItem());
            HubContextMock.MockHub();

            var result = await _controller.Remove(It.IsAny<int>()) as OkResult;

            Assert.Equal(200, result.StatusCode);
        }
    }
}
