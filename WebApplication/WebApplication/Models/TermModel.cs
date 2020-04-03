using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication.Models
{
    public class TermModel
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public string Description { get; set; }

        public string Source { get; set; }

        [Required]
        public bool IsFullMatch { get; set; }

        public List<long> Themes { get; set; }
    }
}
