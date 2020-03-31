﻿using DataAnnotationsExtensions;
using System.ComponentModel.DataAnnotations;

namespace JagWebApp.Resources
{
    public class UpdateUserResource
    {
        [Email]
        public string Email { get; set; }

        [Phone]
        public string PhoneNumber { get; set; }

        public AddressResource Address { get; set; }
    }
}
