using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication.Interfaces.Authorization;
using WebApplication.Models.Authorization;

namespace WebApplication.Controllers.Authorization
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        #region Private Members

        public IAuthService _authService;

        #endregion

        #region Constructor

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        #endregion

        #region Calls

        [HttpPost]
        [Route("")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<AuthorizationResponse>> AddTheme([FromBody]LoginModel model)
        {
            if (model == null)
                return BadRequest("Model is empty");

            var response = await _authService.Login(model);

            if (response == null)
                return NotFound("User not found!");

            return Ok(response);
        }

        #endregion
    }
}
