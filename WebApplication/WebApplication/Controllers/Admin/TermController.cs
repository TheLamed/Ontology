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
    [Route("api/term")]
    public class TermController : ControllerBase
    {
        #region Private Members

        public ITermService _termService;

        #endregion

        #region Constructor

        public TermController(ITermService termService)
        {
            _termService = termService;
        }

        #endregion

        #region Calls

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<bool>> AddTerm([FromBody]TermModel model)
        {
            if (model == null)
                return BadRequest("Model is empty");

            if (!ModelState.IsValid)
                return BadRequest("Model is not valid");

            return Ok(await _termService.AddTerm(model));
        }

        [HttpDelete]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<bool>> DeleteTerm(long id)
        {
            return Ok(await _termService.DeleteTerm(id));
        }

        [HttpPut]
        [Route("{id:long}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<bool>> UpdateTerm(long id, [FromBody]TermModel model)
        {
            if (model == null)
                return BadRequest("Model is empty");

            if (!ModelState.IsValid)
                return BadRequest("Model is not valid");

            return Ok(await _termService.UpdateTerm(id, model));
        }

        [HttpGet]
        [Route("{termId:long}/{themeId:long}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<bool>> AddThemeToTerm(long termId, long themeId)
        {
            return Ok(await _termService.AddThemeToTerm(termId, themeId));
        }

        [HttpDelete]
        [Route("{termId:long}/{themeId:long}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<bool>> DeleteThemeFromTerm(long termId, long themeId)
        {
            return Ok(await _termService.DeleteThemeFromTerm(termId, themeId));
        }

        #endregion
    }
}
