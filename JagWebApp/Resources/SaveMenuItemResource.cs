using DataAnnotationsExtensions;
using JagWebApp.Utilities;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;

namespace JagWebApp.Resources
{
    public class SaveMenuItemResource
    {
        public int Id { get; set; }

        [CollectionLength]
        public ICollection<int> Dishes { get; set; }

        [Min(0)]
        public decimal Price { get; set; }

        [Min(0)]
        public int Limit { get; set; }

        public SaveMenuItemResource()
        {
            Dishes = new Collection<int>();
        }
    }
}
