using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication.Models
{
    public class BindingInfoModel
    {
        public bool InProgress { get; set; }
        public long TotalCount { get; set; }
        public long UnindexedCount { get; set; }
        public double Percent { get; set; }
    }
}
