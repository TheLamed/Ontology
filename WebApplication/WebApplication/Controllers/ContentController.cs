using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication.Interfaces;
using WebApplication.Models.Content;

namespace WebApplication.Controllers
{
    [ApiController]
    [Route("api/content")]
    public class ContentController : ControllerBase
    {
        #region Private Members

        public IContentService _contentService;

        #endregion

        #region Constructor

        public ContentController(IContentService contentService)
        {
            _contentService = contentService;
        }

        #endregion

        #region Calls

        [HttpGet]
        [Route("{id:long}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<TermViewModel>> ViewTerm(long id)
        {
            var response = await _contentService.ViewTerm(id);

            if (response == null)
                return NotFound("Term not found!");

            return Ok(response);
        }


        #endregion
    }
}
