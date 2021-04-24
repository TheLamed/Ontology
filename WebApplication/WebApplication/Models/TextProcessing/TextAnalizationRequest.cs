using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication.Models.TextProcessing
{
    public class TextAnalizationRequest
    {
        [Required]
        public string Text { get; set; }

        public bool IncludeTermsShowing { get; set; } = false;
        public bool IncludeParagraphAnalization { get; set; } = false;
        public bool IncludeSentenceAnalization { get; set; } = false;
    }
}
