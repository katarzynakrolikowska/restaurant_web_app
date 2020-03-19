using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace JagWebApp.Core.Models
{
    public class Role : IdentityRole<int>
    {
        public static string Admin = "Admin";
        public ICollection<UserRole> UserRoles { get; set; }
    }
}
