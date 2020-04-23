using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication.Models.Authorization;

namespace WebApplication.Interfaces.Authorization
{
    public interface IAuthService
    {
        Task<AuthorizationResponse> Login(LoginModel model);
    }
}
