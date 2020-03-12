using AutoMapper;
using JagWebApp.Controllers;
using JagWebApp.Core;
using JagWebApp.Core.Models;
using JagWebApp.Hubs;
using JagWebApp.Resources;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Moq;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace JagWebApp.Tests.Controllers
{
    public class MenuControllerTests
    {
        private readonly Mock<IMenuRepository> _menuRepo;
        private readonly Mock<IDishRepository> _dishRepo;
        private readonly Mock<IUnitOfWork> _unitOfWork;
        private readonly IMapper _mapper;
        private readonly Mock<IHubContext<MenuItemHub>> _hub;
        private readonly MenuController _controller;

        public MenuControllerTests()
        {
            _mapper = new MapperConfiguration(mc => mc.AddProfile(new MappingProfile())).CreateMapper();
            _menuRepo = new Mock<IMenuRepository>();
            _dishRepo = new Mock<IDishRepository>();
            _unitOfWork = new Mock<IUnitOfWork>();
            _hub = new Mock<IHubContext<MenuItemHub>>();
            _controller = new MenuController(
                _menuRepo.Object,
                _dishRepo.Object,
                _unitOfWork.Object,
                _mapper,
                _hub.Object);
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
            _menuRepo.Setup(mr => mr.GetMenuItems());

            await _controller.GetMenu();

            _menuRepo.Verify(mr => mr.GetMenuItems());
        }

        [Fact]
        public async void GetMenu_WhenCalled_ReturnsOkObjectResultWithMenuItems()
        {
            var menuItems = new List<MenuItem>() { new MenuItem(), new MenuItem() };
            _menuRepo.Setup(mr => mr.GetMenuItems())
                .ReturnsAsync(menuItems);

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
            _menuRepo.Setup(mr => mr.GetMainMenuItem())
                .ReturnsAsync(new MenuItem());

            var result = await _controller.Create(saveMenuItem) as BadRequestObjectResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void Create_WhenDishesNotExist_ReturnsBadRequestObjectResult()
        {
            MockDishesExsitMethod(false);

            var result = await _controller.Create(new SaveMenuItemResource()) as BadRequestObjectResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void Create_WhenDishExistsAndModelIsValid_MenuItemIsSaved()
        {
            MockDishesExsitMethod(true);
            _menuRepo.Setup(mr => mr.Add(It.IsAny<MenuItem>()));

            await _controller.Create(new SaveMenuItemResource());

            _menuRepo.Verify(mr => mr.Add(It.IsAny<MenuItem>()));
        }

        [Fact]
        public async void Create_WhenDishExistsAndModelIsValid_ReturnsOkResult()
        {
            MockDishesExsitMethod(true);
            _menuRepo.Setup(mr => mr.Add(It.IsAny<MenuItem>()));

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
            var result = await _controller
                .UpdateMenuItem(It.IsAny<int>(), It.IsAny<UpdateMenuItemResource>()) as NotFoundResult;

            Assert.Equal(404, result.StatusCode);
        }

        [Fact]
        public async void UpdateMenuItem_WhenMenuItemExists_ItemIsUpdated()
        {
            var dish = new Dish
            {
                Id = 1,
                Name = "a",
                Category = new Category { Id = 1, Name = "a" },
                Amount = 2
            };
            var item = new MenuItem()
            {
                Dishes = new Collection<MenuItemDish> { new MenuItemDish { DishId = 1, Dish = dish } },
                Price = 1,
                Limit = 1,
                Available = 1,
                IsMain = true
            };
            var updateItem = new UpdateMenuItemResource
            {
                Dishes = new Collection<int> { 1 },
                Price = 2,
                Available = 2,
            };
            MockRepoToReturnMenuItem(item);
            MockHub();

            await _controller.UpdateMenuItem(It.IsAny<int>(), updateItem);

            _unitOfWork.Verify(u => u.CompleteAsync());
            Assert.Equal(1, item.Dishes.Count);
            Assert.Equal(2, item.Price);
            Assert.Equal(2, item.Available);
            Assert.Equal(2, item.Limit);
        }

        [Fact]
        public async void UpdateMenuItem_WhenMenuItemExists_ReturnsOkResult()
        {
            MockRepoToReturnMenuItem(new MenuItem());
            MockHub();

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
            var result = await _controller.Remove(It.IsAny<int>()) as NotFoundResult;

            Assert.Equal(404, result.StatusCode);
        }

        [Fact]
        public async void Remove_WhenMenuItemExists_ItemIsRemoved()
        {
            var item = new MenuItem();
            MockRepoToReturnMenuItem(item);
            _menuRepo.Setup(mr => mr.Remove(It.IsAny<MenuItem>()));
            MockHub();

            await _controller.Remove(It.IsAny<int>());

            _menuRepo.Verify(mr => mr.Remove(item));
            _unitOfWork.Verify(u => u.CompleteAsync());
        }

        [Fact]
        public async void Remove_WhenMenuItemExists_ReturnsOkResult()
        {
            MockRepoToReturnMenuItem(new MenuItem());
            MockHub();

            var result = await _controller.Remove(It.IsAny<int>()) as OkResult;

            Assert.Equal(200, result.StatusCode);
        }

        private void MockDishesExsitMethod(bool valueToReturn)
        {
            _dishRepo.Setup(dr => dr.DishesExist(It.IsAny<IEnumerable<int>>()))
                .ReturnsAsync(valueToReturn);
        }

        private void MockRepoToReturnMenuItem(MenuItem item)
        {
            _menuRepo.Setup(mr => mr.GetMenuItem(It.IsAny<int>()))
                .ReturnsAsync(item);
        }

        private void MockHub()
        {
            Mock<IClientProxy> mockClientProxy = new Mock<IClientProxy>();
            Mock<IHubClients> mockClients = new Mock<IHubClients>();
            Mock<IGroupManager> mockGroups = new Mock<IGroupManager>();

            mockClients.Setup(clients => clients.All).Returns(mockClientProxy.Object);

            CancellationToken cancellationToken = default;
            mockGroups.Object.AddToGroupAsync("1234", "DataGroup", cancellationToken);

            _hub.Setup(x => x.Clients.All).Returns(mockClientProxy.Object);
            _hub.Setup(groups => groups.Groups).Returns(mockGroups.Object);
        }
    }
}
