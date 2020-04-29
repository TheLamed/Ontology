using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication.Interfaces.Admin;
using WebApplication.Models.Themes;
using WebApplication.Services.Admin;

namespace WebApplication.Controllers.Admin
{
    [ApiController]
    [Route("api/theme")]
    public class ThemeController : ControllerBase
    {
        #region Private Members

        public IThemeService _themeService;

        #endregion

        #region Constructor

        public ThemeController(IThemeService themeService)
        {
            _themeService = themeService;
        }

        #endregion

        #region Calls

        [HttpPost]
        [Route("")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<bool>> AddTheme([FromBody]AddThemeModel model)
        {
            if (model == null) 
                return BadRequest("Model is empty");
            
            if(!ModelState.IsValid)
                return BadRequest("Model is not valid");

            return Ok(await _themeService.AddTheme(model));
        }

        [HttpDelete]
        [Route("{id:long}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<bool>> DeleteTheme(long id)
        {
            return Ok(await _themeService.DeleteTheme(id));
        }

        [HttpPut]
        [Route("{id:long}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<bool>> UpdateTheme(long id, [FromBody]AddThemeModel model)
        {
            if (model == null)
                return BadRequest("Model is empty");

            if (!ModelState.IsValid)
                return BadRequest("Model is not valid");

            return Ok(await _themeService.UpdateTheme(id, model));
        }

        [HttpGet]
        [Route("")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<ThemeModel>>> GetThemes()
        {
            return Ok(await _themeService.GetThemes());
        }

        #endregion

    }
}
