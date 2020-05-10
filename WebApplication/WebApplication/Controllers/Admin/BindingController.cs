using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication.Interfaces.Admin;
using WebApplication.Models;

namespace WebApplication.Controllers.Admin
{
    [ApiController]
    [Route("api/binding")]
    public class BindingController : ControllerBase
    {
        #region Private Members

        public ITermBindingService _bindingService;

        #endregion

        #region Constructor

        public BindingController(ITermBindingService bindingService)
        {
            _bindingService = bindingService;
        }

        #endregion

        #region Calls

        [HttpGet]
        [Route("")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<bool>> StartProcessing()
        {
            _bindingService.StartProcessing();
            return Ok(true);
        }

        [HttpGet]
        [Route("info")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<BindingInfoModel>> GetInfo()
        {
            return Ok(await _bindingService.GetBindingInfo());
        }

        #endregion
    }
}
