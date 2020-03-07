using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication.Models.Entities
{
    public class Theme
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<Subtheme> Children { get; set; }
        public List<Subtheme> Parents { get; set; }
    }
}
