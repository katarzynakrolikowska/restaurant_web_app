using DataAnnotationsExtensions;

namespace JagWebApp.Resources
{
    public class SaveDishResource
    {
        public int Id { get; set; }

        public string Name { get; set; }

        [Min(0)]
        public int Amount { get; set; }

        public int CategoryId { get; set; }
    }
}
