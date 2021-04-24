using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication.Models.TextProcessing;
using WebApplication.Services;

namespace WebApplication.Controllers
{
    [ApiController]
    [Route("api/text-analysis")]
    public class TextAnalysationConroller : ControllerBase
    {
        #region Private Members

        public TextProcessingService _service;

        #endregion

        #region Constructor

        public TextAnalysationConroller(TextProcessingService service)
        {
            _service = service;
        }

        #endregion

        #region Calls

        [HttpPost]
        [Route("")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<AnalysedTextModel>> TextAnalysis([FromBody] TextAnalizationRequest model)
        {
            var response = await _service.TextAnalysis(model);

            return Ok(response);
        }

        #endregion
    }
}
