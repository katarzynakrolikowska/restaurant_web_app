﻿using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JagWebApp.Core.Models
{
    public class Role : IdentityRole<int>
    {
        public static string Admin = "Admin";
        public ICollection<UserRole> UserRoles { get; set; }
    }
}