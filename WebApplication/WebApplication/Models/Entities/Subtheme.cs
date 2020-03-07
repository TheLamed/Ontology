using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication.Models.Entities
{
    public class Subtheme
    {
        public int Id { get; set; }
        public int FromId { get; set; }
        public Theme From { get; set; }
        public int ToId { get; set; }
        public Theme To { get; set; }
    }
}
