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

        public string GetRandomTerms()
        {
            return "MATCH (n:Term) " +
                "WITH n, rand() AS r " +
                "ORDER BY r " +
                "RETURN n AS term, [(n)-->(t:Theme) | t] AS themes" +
                "LIMIT {0}";
        }

        public string GetContent(string sort, string name, IEnumerable<long> themes)
        {
            var str = "MATCH (n:Term)";

            var isThemes = false;
            if(themes != null && themes.Count() > 0)
            {
                isThemes = true;
                str += "-->(m:Theme) " +
                    $"WHERE id(m) in [{string.Join(", ", themes)}] ";
            }

            if(name != null)
                if (isThemes)
                    str += "AND n.name CONTAINS $Name ";
                else
                    str += "WHERE n.name CONTAINS $Name ";

            str += "RETURN n AS node, [(n)-->(t:Theme) | t] AS themes ";

            if (!string.IsNullOrEmpty(sort))
            {
                if (sort == "desc")
                    str += $"ORDER BY n.name DESC ";
                if (sort == "asc")
                    str += $"ORDER BY n.name ";
            }

            return str +
                "SKIP {0} " +
                "LIMIT {1}";
        }

        public string GetContentCount(string sort, string name, IEnumerable<long> themes)
        {
            var str = "MATCH (n:Term)";

            var isThemes = false;
            if (themes != null && themes.Count() > 0)
            {
                isThemes = true;
                str += "-->(m:Theme) " +
                    $"WHERE id(m) in [{string.Join(", ", themes)}] ";
            }

            if (name != null)
                if (isThemes)
                    str += "AND n.name CONTAINS $Name ";
                else
                    str += "WHERE n.name CONTAINS $Name ";

            return str + "RETURN COUNT(n) AS count ";
        }

        //public string GetWhereName()
        //{
        //    return "WHERE n.name CONTAINS $Name ";
        //}

        //public string GetWhereThemes(IEnumerable<long> themes)
        //{
        //    return "WHERE (n)-->() ";
        //}
    }
}
