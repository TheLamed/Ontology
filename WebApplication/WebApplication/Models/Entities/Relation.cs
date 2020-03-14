using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication.Models.Entities
{
    public class Relation<TFrom, TTo>
    {
        public int Id { get; set; }
        public int FromId { get; set; }
        public int ToId { get; set; }
        public TFrom From { get; set; }
        public TTo To { get; set; }
    }
}
