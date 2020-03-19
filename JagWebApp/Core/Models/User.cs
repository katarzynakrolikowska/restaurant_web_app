using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Security.Claims;

namespace JagWebApp.Core.Models
{
    public class User : IdentityUser<int>
    {
        public ICollection<UserRole> UserRoles { get; set; }

        public static int? GetLoggedInUserId(ClaimsIdentity claimsIdentity)
        {
            try
            {
                var id = claimsIdentity.FindFirst(ClaimTypes.NameIdentifier).Value;
                return int.Parse(id);
            }
            catch (Exception)
            {
                return null;
            }
        }
    }
}
