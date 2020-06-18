using AutoMapper;
using JagWebApp.Controllers;
using JagWebApp.Core;
using JagWebApp.Core.Models;
using JagWebApp.Resources.MenuItemResources;
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
        private readonly CartRepositoryMock _cartRepositoryMock;

        public MenuControllerTests()
        {
            var menuRepo = new Mock<IMenuRepository>();
            var dishRepo = new Mock<IDishRepository>();
            var unitOfWork = new Mock<IUnitOfWork>();
            var cartRepo = new Mock<ICartRepository>();
            var mapper = new MapperConfiguration(mc => mc.AddProfile(new MappingProfile())).CreateMapper();
            var hub = HubContextMock.Hub;

            _controller = new MenuController(
                menuRepo.Object, 
                dishRepo.Object, 
                unitOfWork.Object, 
                cartRepo.Object, 
                mapper, 
                hub.Object);

            _dishRepositoryMock = new DishRepositoryMock(dishRepo);
            _menuRepositoryMock = new MenuRepositoryMock(menuRepo);
            _unitOfWorkMock = new UnitOfWorkMock(unitOfWork);
            _cartRepositoryMock = new CartRepositoryMock(cartRepo);
        }

        [Fact]
        public void GetMenuAsync_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.GetMenuAsync();

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public async void GetMenuAsync_WhenCalled_GetMenuItemsFromRepoIsCalled()
        {
            _menuRepositoryMock.MockGetMenuItems(new List<MenuItem>());

            await _controller.GetMenuAsync();

            _menuRepositoryMock.VerifyGetMenuItems();
        }

        [Fact]
        public async void GetMenuAsync_WhenCalled_ReturnsOkObjectResultWithMenuItems()
        {
            var menuItems = new List<MenuItem>() { new MenuItem(), new MenuItem() };
            _menuRepositoryMock.MockGetMenuItems(menuItems);

            var result = await _controller.GetMenuAsync() as OkObjectResult;
            var values = result.Value as List<MenuItemResource>;

            Assert.Equal(200, result.StatusCode);
            Assert.Equal(2, values.Count);
        }

        [Fact]
        public void GetMenuItemAsync_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.GetMenuItemAsync(It.IsAny<int>());

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public async void GetMenuItemAsync_WhenCalled_GetMenuItemFromRepoIsCalled()
        {
            _menuRepositoryMock.MockGetMenuItem(new MenuItem());

            await _controller.GetMenuItemAsync(It.IsAny<int>());

            _menuRepositoryMock.VerifyGetMenuItem();
        }

        [Fact]
        public async void GetMenuItemAsync_WhenMenuItemIsNull_ReturnsNotFoundResult()
        {
            MenuItem item = null;
            _menuRepositoryMock.MockGetMenuItem(item);

            var result = await _controller.GetMenuItemAsync(It.IsAny<int>()) as NotFoundResult;

            Assert.Equal(404, result.StatusCode);
        }

        [Fact]
        public async void GetMenuItemAsync_WhenMenuItemExists_ReturnsOkObjectResult()
        {
            _menuRepositoryMock.MockGetMenuItem(new MenuItem());

            var result = await _controller.GetMenuItemAsync(It.IsAny<int>()) as OkObjectResult;

            Assert.IsType<MenuItemResource>(result.Value);
            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public void GetMainMenuItemAsync_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.GetMainMenuItemAsync();

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public async void GetMainMenuItemAsync_WhenCalled_GetMainMenuItemFromRepoIsCalled()
        {
            _menuRepositoryMock.MockGetMainMenuItem(new MenuItem());

            await _controller.GetMainMenuItemAsync();

            _menuRepositoryMock.VerifyGetMainMenuItem();
        }

        [Fact]
        public async void GetMainMenuItemAsync_WhenMainMenuItemIsNull_ReturnsNotFoundResult()
        {
            MenuItem item = null;
            _menuRepositoryMock.MockGetMainMenuItem(item);

            var result = await _controller.GetMainMenuItemAsync() as NotFoundResult;

            Assert.Equal(404, result.StatusCode);
        }

        [Fact]
        public async void GetMainMenuItemAsync_WhenMainMenuItemExists_ReturnsOkObjectResult()
        {
            _menuRepositoryMock.MockGetMainMenuItem(new MenuItem());

            var result = await _controller.GetMainMenuItemAsync() as OkObjectResult;

            Assert.IsType<MenuItemResource>(result.Value);
            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public void CreateAsync_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.CreateAsync(It.IsAny<SaveMenuItemResource>());

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public async void CreateAsync_WhenSaveMenuItemIsMainItemAndMainMenuItemExsist_ReturnsBadRequestObjectResult()
        {
            var saveMenuItem = new SaveMenuItemResource { IsMain = true };
            _menuRepositoryMock.MockGetMainMenuItem(new MenuItem());

            var result = await _controller.CreateAsync(saveMenuItem) as BadRequestObjectResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void CreateAsync_WhenDishesNotExist_ReturnsBadRequestObjectResult()
        {
            _dishRepositoryMock.MockDishesExist(false);

            var result = await _controller.CreateAsync(new SaveMenuItemResource()) as BadRequestObjectResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void CreateAsync_WhenDishExistsAndModelIsValid_MenuItemIsSaved()
        {
            _dishRepositoryMock.MockDishesExist(true);
            _menuRepositoryMock.MockAdd();

            await _controller.CreateAsync(new SaveMenuItemResource());

            _menuRepositoryMock.VerifyAdd();
        }

        [Fact]
        public async void CreateAsync_WhenDishExistsAndModelIsValid_ReturnsOkResult()
        {
            _dishRepositoryMock.MockDishesExist(true);
            _menuRepositoryMock.MockAdd();

            var result = await _controller.CreateAsync(new SaveMenuItemResource()) as OkResult;

            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public void UpdateAsync_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.UpdateAsync(It.IsAny<int>(), It.IsAny<UpdateMenuItemResource>());

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public async void UpdateAsync_WhenMenuItemDoesNotExist_ReturnsNotFoundResult()
        {
            MenuItem item = null;
            _menuRepositoryMock.MockGetMenuItem(item);

            var result = await _controller
                .UpdateAsync(It.IsAny<int>(), It.IsAny<UpdateMenuItemResource>()) as NotFoundResult;

            Assert.Equal(404, result.StatusCode);
        }

        [Fact]
        public async void UpdateAsync_WhenMenuItemExists_ItemIsUpdated()
        {
            var item = MenuItemStub.GetMenuItem();
            var updateItem = UpdateMenuItemStub.GetUpdateMenuItem();
            _menuRepositoryMock.MockGetMenuItem(item);
            _unitOfWorkMock.MockCompleteAsync();
            _cartRepositoryMock.MockUpdateCartItemAmountContainsMenuItem(item);
            HubContextMock.MockHub();

            await _controller.UpdateAsync(1, updateItem);

            _cartRepositoryMock.VerifyUpdateCartItemAmountContainsMenuItem(item);
            _unitOfWorkMock.VerifyCompleteAsync();
            Assert.Equal(1, item.Dishes.Count);
            Assert.Equal(2, item.Price);
            Assert.Equal(2, item.Available);
        }

        [Fact]
        public async void UpdateAsync_WhenMenuItemExists_ReturnsOkResult()
        {
            _menuRepositoryMock.MockGetMenuItem(new MenuItem());
            HubContextMock.MockHub();

            var result = await _controller.UpdateAsync(It.IsAny<int>(), new UpdateMenuItemResource()) as OkResult;

            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public void RemoveAsync_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.RemoveAsync(It.IsAny<int>());

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public async void RemoveAsync_WhenMenuItemDoesNotExist_ReturnsNotFoundResult()
        {
            MenuItem item = null;
            _menuRepositoryMock.MockGetMenuItem(item);

            var result = await _controller.RemoveAsync(It.IsAny<int>()) as NotFoundResult;

            Assert.Equal(404, result.StatusCode);
        }

        [Fact]
        public async void RemoveAsync_WhenMenuItemExists_ItemIsRemoved()
        {
            var item = new MenuItem();
            _menuRepositoryMock.MockGetMenuItem(item);
            _menuRepositoryMock.MockRemove();
            _unitOfWorkMock.MockCompleteAsync();
            HubContextMock.MockHub();

            await _controller.RemoveAsync(It.IsAny<int>());

            _menuRepositoryMock.VerifyRemove(item);
            _unitOfWorkMock.VerifyCompleteAsync();
        }

        [Fact]
        public async void RemoveAsync_WhenMenuItemExists_ReturnsOkResult()
        {
            _menuRepositoryMock.MockGetMenuItem(new MenuItem());
            HubContextMock.MockHub();

            var result = await _controller.RemoveAsync(It.IsAny<int>()) as OkResult;

            Assert.Equal(200, result.StatusCode);
        }
    }
}
