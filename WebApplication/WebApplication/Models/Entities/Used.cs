using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication.Models.Entities
{
    public class Used
    {
        public int Id { get; set; }
        public int FromId { get; set; }
        public Term From { get; set; }
        public int ToId { get; set; }
        public Term To { get; set; }
    }
}
