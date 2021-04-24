using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication.Services
{
    public class TextPrecessingTransactionsService
    {
        public string GetTerms()
        {
            return "MATCH (n:Term) RETURN n";
        }

        public string GetCountOfTransitions(long from, long to, long i)
        {
            if(i == 0)
                return $"MATCH (n:Term) WHERE id(n)={from} " +
                    $"MATCH (t:Term) WHERE id(t)={to} " +
                    $"MATCH (n)-[r:Used]-(t) " +
                    $"RETURN COUNT(r) ";
            else
                return $"MATCH (n:Term) WHERE id(n)={from} " +
                    $"MATCH (t:Term) WHERE id(t)={to} " +
                    $"MATCH (n)-[r:Used*{i}]-(t) " +
                    $"RETURN COUNT(r) ";
        }
    }
}
