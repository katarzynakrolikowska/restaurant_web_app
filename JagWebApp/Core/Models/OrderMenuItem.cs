namespace JagWebApp.Core.Models
{
    public class OrderMenuItem
    {
        public int OrderId { get; set; }

        public Order Order { get; set; }

        public int MenuItemId { get; set; }

        public MenuItem MenuItem { get; set; }

        public int Amount { get; set; }
    }
}
