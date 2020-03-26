using DataAnnotationsExtensions;
using JagWebApp.Utilities;

namespace JagWebApp.Resources
{
    public class UpdateCartItemResource
    {
        public int MenuItemId { get; set; }

        [Min(1)]
        [NoExceedAvailable]
        public int Amount { get; set; }

        public int? Available { get; set; }
    }
}
