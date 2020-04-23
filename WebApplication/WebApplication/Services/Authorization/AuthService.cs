using Neo4j.Driver.V1;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication.Interfaces;
using WebApplication.Interfaces.Authorization;
using WebApplication.Models;
using WebApplication.Models.Authorization;
using WebApplication.Models.Entities;

namespace WebApplication.Services.Authorization
{
    public class AuthService : IAuthService
    {
        #region Private Members

        private DBService _db;
        private ITokenService _tokenService;
        private TransactionService _transaction;

        #endregion

        #region Constructor

        public AuthService
        (
            DBService db,
            ITokenService tokenService,
            TransactionService transaction
        )
        {
            _db = db;
            _tokenService = tokenService;
            _transaction = transaction;
        }

        #endregion

        #region IAuthService implementation

        public async Task<AuthorizationResponse> Login(LoginModel model)
        {
            using (var session = _db.GetSession())
            {
                try
                {
                    var result = await session.RunAsync(_transaction.GetUser(), model);
                    var record = await result.SingleAsync();

                    if (record.Values.Single().Value is INode node)
                    {
                        var user = new User(node);

                        return new AuthorizationResponse()
                        {
                            Token = await _tokenService.GenerateToken(user),
                            User = new UserModel(user),
                        };
                    }
                    else
                    {
                        return null;
                    }
                }
                catch(Exception e)
                {
                    return null;
                }
            }
        }

        #endregion
    }
}
