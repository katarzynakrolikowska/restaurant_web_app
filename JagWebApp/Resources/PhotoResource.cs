namespace JagWebApp.Resources
{
    public class PhotoResource
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string ThumbnailName { get; set; }

        public bool IsMain { get; set; }

        public int DishId { get; set; }
    }
}
