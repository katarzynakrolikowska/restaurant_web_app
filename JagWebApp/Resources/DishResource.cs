using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;

namespace JagWebApp.Resources
{
    public class DishResource
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public decimal Price { get; set; }

        public int Amount { get; set; }

        public CategoryResource Category { get; set; }

        public PhotoResource MainPhoto { get; set; }
    }
}
