﻿using JagWebApp.Core;
using JagWebApp.Core.Models;
using Moq;
using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace JagWebApp.Tests.Mocks
{
    class MenuRepositoryMock
    {
        private Mock<IMenuRepository> _menuRepo;

        public MenuRepositoryMock(Mock<IMenuRepository> menuRepo)
        {
            _menuRepo = menuRepo;
        }

        public void MockGetMenuItemWithDish(MenuItem item)
        {
            _menuRepo.Setup(mr => mr.GetMenuItemWithDishAsync(It.IsAny<int>()))
                .ReturnsAsync(item);
        }

        public void MockGetMenuItems(ICollection<MenuItem> items)
        {
            _menuRepo.Setup(mr => mr.GetMenuItemsAsync())
               .ReturnsAsync(items);
        }

        public void MockGetMainMenuItem(MenuItem item)
        {
            _menuRepo.Setup(mr => mr.GetMainMenuItemAsync())
                .ReturnsAsync(item);
        }

        public void MockAdd()
        {
            _menuRepo.Setup(mr => mr.Add(It.IsAny<MenuItem>()));
        }

        public void MockGetMenuItem(MenuItem item)
        {
            _menuRepo.Setup(mr => mr.GetMenuItemAsync(It.IsAny<int>()))
                .ReturnsAsync(item);
        }

        public void MockRemove()
        {
            _menuRepo.Setup(mr => mr.Remove(It.IsAny<MenuItem>()));
        }

        public void MockUpdateAvailability()
        {
            _menuRepo.Setup(mr => mr.UpdateAvailabilityAsync(It.IsAny<Collection<CartItem>>()));
        }

        public void VerifyGetMenuItems()
        {
            _menuRepo.Verify(mr => mr.GetMenuItemsAsync());
        }

        public void VerifyGetMenuItem()
        {
            _menuRepo.Verify(mr => mr.GetMenuItemAsync(It.IsAny<int>()));
        }

        public void VerifyGetMainMenuItem()
        {
            _menuRepo.Verify(mr => mr.GetMainMenuItemAsync());
        }

        public void VerifyAdd()
        {
            _menuRepo.Verify(mr => mr.Add(It.IsAny<MenuItem>()));
        }

        public void VerifyRemove(MenuItem item)
        {
            _menuRepo.Verify(mr => mr.Remove(item));
        }

        public void VerifyUpdateAvailability()
        {
            _menuRepo.Verify(mr => mr.UpdateAvailabilityAsync(It.IsAny<Collection<CartItem>>()));
        }
    }
}
