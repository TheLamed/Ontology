using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication.Models.Entities
{
    public class Term : Node
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Source { get; set; }
        public bool IsFullMatch { get; set; }
        public Status Status { get; set; }

        public List<Used> UsedIn { get; set; }
        public List<Used> UsedBy { get; set; }
    }
}
