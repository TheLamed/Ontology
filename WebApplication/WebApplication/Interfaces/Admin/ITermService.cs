using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication.Models;

namespace WebApplication.Interfaces.Admin
{
    public interface ITermService
    {
        Task<bool> AddTerm(EditTermModel model);
        Task<bool> UpdateTerm(long id, EditTermModel model);
        Task<bool> DeleteTerm(long id);
        Task<bool> AddThemeToTerm(long tremId, long themeId);
        Task<bool> DeleteThemeFromTerm(long tremId, long themeId);
        Task<PagingList<TermModel>> GetTerms(int pn = 0, int ps = 10, string sort = "acs");
    }
}
