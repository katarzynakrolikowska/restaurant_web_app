using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace JagWebApp.Resources
{
    public class SaveCartItemResource
    {
        
        public int MenuItemId { get; set; }

        public int CartId { get; set; }
    }
}
