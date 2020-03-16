using JagWebApp.Resources;
using System.Collections.ObjectModel;

namespace JagWebApp.Tests.Stubs
{
    class UpdateMenuItemStub
    {
        public static UpdateMenuItemResource GetUpdateMenuItem()
        {
            return new UpdateMenuItemResource
            {
                Dishes = new Collection<int> { 1 },
                Price = 2,
                Available = 2,
            };
        }
    }
}
