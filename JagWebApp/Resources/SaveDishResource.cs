using DataAnnotationsExtensions;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

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
