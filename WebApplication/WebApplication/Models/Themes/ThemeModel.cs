using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication.Models.Entities;

namespace WebApplication.Models.Themes
{
    public class ThemeModel
    {
        public long Id { get; set; }

        public string Name { get; set; }

        public List<long> Parents { get; set; }

        public ThemeModel()
        {

        }

        public ThemeModel(Theme theme)
        {
            Id = theme.Id;
            Name = theme.Name;
            Parents = new List<long>();
        }
    }
}
