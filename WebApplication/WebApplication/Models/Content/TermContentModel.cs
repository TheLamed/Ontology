using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication.Models.Entities;

namespace WebApplication.Models.Content
{
    public class TermContentModel
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public List<IdValueModel> Themes { get; set; }

        public TermContentModel()
        {

        }

        public TermContentModel(Term term)
        {
            Id = term.Id;
            Name = term.Name;
            Description = term.Description;
            Themes = new List<IdValueModel>();
        }

        public TermContentModel(Term term, List<Theme> themes)
            : this(term)
        {
            Themes = themes.Select(v => new IdValueModel()
            {
                Id = v.Id,
                Value = v.Name
            }).ToList();
        }
    }
}
