using DataAnnotationsExtensions;
using JagWebApp.Utilities;
using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace JagWebApp.Resources
{
    public class SaveMenuItemResource
    {
        [CollectionLength]
        public ICollection<int> Dishes { get; set; }

        [Min(0)]
        public decimal Price { get; set; }

        [Min(0)]
        public int Available { get; set; }

        public bool IsMain { get; set; }

        public SaveMenuItemResource()
        {
            Dishes = new Collection<int>();
        }
    }
}
