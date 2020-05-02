using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication.Models.Entities;
using WebApplication.Models.Themes;

namespace WebApplication.Models
{
    public class TermModel
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Source { get; set; }
        public bool IsFullMatch { get; set; }
        public Status Status { get; set; }
        public List<IdValueModel> Themes { get; set; }

        public TermModel()
        {

        }

        public TermModel(Term term)
        {
            Id = term.Id;
            Name = term.Name;
            Description = term.Description;
            Source = term.Source;
            IsFullMatch = term.IsFullMatch;
            Status = term.Status;
            Themes = new List<IdValueModel>();
        }

        public TermModel(Term term, IEnumerable<Theme> themes)
            : this(term)
        {
            Themes = themes.Select(v => new IdValueModel() { Id = v.Id, Value = v.Name }).ToList();
        }

    }
}
