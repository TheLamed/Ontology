using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication.Services
{
    public class ContentTransactionsService
    {
        public string GetTermView()
        {
            return "MATCH (n:Term) " +
                "WHERE id(n) = {0} " +
                "RETURN n AS node, [(n)-->(t:Theme) | t] AS themes, [(n)-->(m:Term) | m] AS terms ";
        }
    }
}
