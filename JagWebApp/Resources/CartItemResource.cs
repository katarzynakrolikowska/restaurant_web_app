using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JagWebApp.Resources
{
    public class CartItemResource
    {
        public MenuItemResource MenuItem { get; set; }

        public int Amount { get; set; }

    }
}
