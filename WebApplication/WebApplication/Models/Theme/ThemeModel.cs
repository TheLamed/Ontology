using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication.Models.Theme
{
    public class ThemeModel
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public List<ThemeModel> Children { get; set; }
    }
}
