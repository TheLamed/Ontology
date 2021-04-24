using Neo4j.Driver.V1;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApplication.Models.Entities
{
    public class Term : Node
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Source { get; set; }
        public bool IsFullMatch { get; set; }
        public Status Status { get; set; }

        public List<Used> UsedIn { get; set; }
        public List<Used> UsedBy { get; set; }

        public Term()
        {

        }

        public Term(INode node)
        {
            Id = node.Id;
            var type = GetType();
            foreach (var item in node.Properties)
            {
                var key = new StringBuilder(item.Key);
                key[0] = char.ToUpper(key[0]);
                type.GetProperty(key.ToString())?.SetValue(this, item.Value, null);
            }
        }
    }

    public class TermComparer : IEqualityComparer<Term>
    {
        public bool Equals([AllowNull] Term x, [AllowNull] Term y)
        {
            return x.Id == y.Id;
        }

        public int GetHashCode([DisallowNull] Term obj)
        {
            return obj.GetHashCode();
        }
    }
}
