using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace JagWebApp.Core.Models.Identity
{
    public class Role : IdentityRole<int>
    {
        public const string ADMIN = "Admin";

        public ICollection<UserRole> UserRoles { get; set; }
    }
}
