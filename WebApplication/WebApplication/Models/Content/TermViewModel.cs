using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication.Models.Content
{
    public class TermViewModel
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Source { get; set; }
        public List<IdValueModel> Themes { get; set; }
        public List<TermSimpleModel> RelatedTerms { get; set; }
    }
}
