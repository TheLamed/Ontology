using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication.Models.Entities;

namespace WebApplication.Models
{
    public class UserModel
    {
        public long Id { get; set; }
        public string Login { get; set; }
        public string Role { get; set; }

        public UserModel() { }

        public UserModel(User user)
        {
            Id = user.Id;
            Login = user.Login;
            Role = user.Role;
        }
    }
}
