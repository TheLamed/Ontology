using Neo4j.Driver.V1;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApplication.Models.Entities
{
    public class Theme : Node
    {
        public string Name { get; set; }
        public List<Subtheme> Children { get; set; }
        public List<Subtheme> Parents { get; set; }
        public List<Member> Members { get; set; }

        public Theme()
        {

        }

        public Theme(INode node)
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
}
