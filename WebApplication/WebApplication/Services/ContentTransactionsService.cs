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
                "RETURN n AS term, [(n)-->(t:Theme) | t] AS themes " +
                "LIMIT {0}";
        }

        public string GetContent(string sort, string name, IEnumerable<long> themes)
        {
            var str = "MATCH (t:Term)";

            var isThemes = false;
            if(themes != null && themes.Count() > 0)
            {
                isThemes = true;

                str = $"WITH [{string.Join(", ", themes)}] as inputThemes " + str;

                str += "-->(th:Theme) " +
                   $"WHERE id(th) IN inputThemes " +
                    "WITH t, SIZE(inputThemes) as inputCnt, COUNT(DISTINCT th) AS matchedCnt " +
                    "WHERE inputCnt = matchedCnt ";
            }

            if(name != null)
                if (isThemes)
                    str += "AND t.name CONTAINS $Name ";
                else
                    str += "WHERE t.name CONTAINS $Name ";

            str += "RETURN t AS node, [(t)-->(m:Theme) | m] AS themes ";

            if (!string.IsNullOrEmpty(sort))
            {
                if (sort == "desc")
                    str += $"ORDER BY t.name DESC ";
                if (sort == "asc")
                    str += $"ORDER BY t.name ";
            }

            return str +
                "SKIP {0} " +
                "LIMIT {1}";
        }

        public string GetContentCount(string sort, string name, IEnumerable<long> themes)
        {
            var str = "MATCH (t:Term)";

            var isThemes = false;
            if (themes != null && themes.Count() > 0)
            {
                isThemes = true;

                str = $"WITH [{string.Join(", ", themes)}] as inputThemes " + str;

                str += "-->(th:Theme) " +
                   $"WHERE id(th) IN inputThemes " +
                    "WITH t, SIZE(inputThemes) as inputCnt, COUNT(DISTINCT th) AS matchedCnt " +
                    "WHERE inputCnt = matchedCnt ";
            }

            if (name != null)
                if (isThemes)
                    str += "AND t.name CONTAINS $Name ";
                else
                    str += "WHERE t.name CONTAINS $Name ";

            return str + "RETURN COUNT(t) AS count ";
        }

        public string GetThemes()
        {
            return "MATCH (n:Theme) RETURN n";
        }
    }
}
