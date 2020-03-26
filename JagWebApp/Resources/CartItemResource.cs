namespace JagWebApp.Resources
{
    public class CartItemResource
    {
        public int Id { get; set; }

        public MenuItemResource MenuItem { get; set; }

        public int Amount { get; set; }

    }
}
