using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication.Interfaces;
using WebApplication.Models;
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
        
        [HttpGet]
        [Route("find")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<PagingList<TermContentModel>>> GetContent
        (
            [FromQuery]int pn = 0,
            [FromQuery]int ps = 10,
            [FromQuery]string sort = "asc",
            [FromQuery]string name = null,
            [FromQuery]string themes = null
        )
        {
            if (pn < 0) pn = 0;
            if (ps < 0) ps = 0;

            var response = await _contentService.GetContent(pn, ps, sort, name, themes);

            return Ok(response);
        }
        
        [HttpGet]
        [Route("random")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<TermContentModel>>> GetRandomTerms
        (
            [FromQuery]int count = 10
        )
        {
            if (count < 0) count = 0;

            var response = await _contentService.GetRandomTerms(count);

            return Ok(response);
        }

        [HttpGet]
        [Route("themes")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<IdValueModel>>> GetThemes()
        {
            var response = await _contentService.GetThemes();

            return Ok(response);
        }

        #endregion
    }
}
