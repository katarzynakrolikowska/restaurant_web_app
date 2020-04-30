namespace JagWebApp.Resources.DishResources
{
    public class PhotoResource
    {
        public int Id { get; set; }

        public string ThumbnailName { get; set; }

        public bool IsMain { get; set; }

        public int DishId { get; set; }
    }
}
