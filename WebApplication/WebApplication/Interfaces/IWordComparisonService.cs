using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication.Interfaces
{
    public interface IWordComparisonService
    {
        public bool Compare(string first, string second);
    }
}
