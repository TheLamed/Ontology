using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication.Models.Content;

namespace WebApplication.Interfaces
{
    public interface IContentService
    {
        Task<TermViewModel> ViewTerm(long id);
    }
}
