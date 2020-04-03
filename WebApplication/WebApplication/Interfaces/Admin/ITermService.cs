using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication.Models;

namespace WebApplication.Interfaces.Admin
{
    public interface ITermService
    {
        Task<bool> AddTerm(TermModel model);
        Task<bool> UpdateTerm(long id, TermModel model);
        Task<bool> DeleteTerm(long id);
        Task<bool> AddThemeToTerm(long tremId, long themeId);
        Task<bool> DeleteThemeFromTerm(long tremId, long themeId);
    }
}
