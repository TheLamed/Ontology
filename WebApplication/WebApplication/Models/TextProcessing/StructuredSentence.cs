using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication.Models.Entities;

namespace WebApplication.Models.TextProcessing
{
    public class StructuredSentence
    {
        public string OriginalText { get; set; }
        public List<Term> Terms { get; set; }
    }
}
