using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication.Models.Authorization
{
    public class AuthorizationResponse
    {
        public string Token { get; set; }
        public UserModel User { get; set; }
    }
}
