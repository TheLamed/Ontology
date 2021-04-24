using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication.Models.TextProcessing
{
    public class AnalysedSentenceModel
    {
        public string Text { get; set; }
        public decimal? SemanticSize { get; set; }
    }
}
