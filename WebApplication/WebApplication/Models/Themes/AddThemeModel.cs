using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication.Models.Themes
{
    public class AddThemeModel
    {
        [Required]
        public string Name { get; set; }

        public List<long> Parents { get; set; }
    }
}
