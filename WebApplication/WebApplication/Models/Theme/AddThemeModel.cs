﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication.Models.Theme
{
    public class AddThemeModel
    {
        [Required]
        public string Name { get; set; }
    }
}
