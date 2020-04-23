using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using WebApplication.Interfaces;
using WebApplication.Models;
using WebApplication.Models.Entities;

namespace WebApplication.Services
{
    public class TokenService : ITokenService
    {
        #region Private Members

        IConfiguration _configuration;

        #endregion

        #region Constructor

        public TokenService
        (
            IConfiguration configuration
        )
        {
            _configuration = configuration;
        }

        #endregion

        #region ITokenService implementation

        public async Task<string> GenerateToken(User user)
        {
            var authClaims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Role.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Role, user.Role),
            };

            var authOptions = _configuration.GetSection("AuthOptions").Get<AuthOptions>();

            var token = new JwtSecurityToken(
                issuer: authOptions.Issuer,
                audience: authOptions.Audience,
                expires: DateTime.Now.AddMinutes(authOptions.ExpiresInMinutes),
                claims: authClaims,
                signingCredentials: new SigningCredentials(
                    new SymmetricSecurityKey(Encoding.UTF8.GetBytes(authOptions.SecureKey)),
                    SecurityAlgorithms.HmacSha256Signature)
                );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        #endregion
    }
}
