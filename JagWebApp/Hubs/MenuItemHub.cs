using Microsoft.AspNetCore.SignalR;

namespace JagWebApp.Hubs
{
    public class MenuItemHub : Hub
    {
        public const string UPDATED_ITEM_METHOD_NAME = "transferUpdatedItem";
        public const string DELETED_ITEM_METHOD_NAME = "transferDeletedItem";
    }
}