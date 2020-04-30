using JagWebApp.Resources.CategoryResources;

namespace JagWebApp.Resources.DishResources
{
    public class DishResource
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public int Amount { get; set; }

        public CategoryResource Category { get; set; }

        public PhotoResource MainPhoto { get; set; }
    }
}
