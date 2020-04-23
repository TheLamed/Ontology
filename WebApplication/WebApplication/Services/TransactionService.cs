using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication.Services
{
    public class TransactionService
    {
        public string GetUser()
        {
            return "MATCH (u:User) " +
                "WHERE u.login = $Login AND u.password = $Password " +
                "RETURN u";
        }
    }
}
