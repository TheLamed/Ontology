using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication.Models.TextProcessing
{
    public class AnalysedTextModel
    {
        public string Text { get; set; }
        public List<TermModel> Terms { get; set; }
        public List<AnalysedParagraphModel> Paragraphs { get; set; }

        public decimal SemanticSize { get; set; }
    }
}
