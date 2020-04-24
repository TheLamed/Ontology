using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication.Models.Entities;
using WebApplication.Models.Themes;

namespace WebApplication.Interfaces.Admin
{
    public interface IThemeService
    {
        Task<List<ThemeModel>> GetThemes();
        Task<bool> AddTheme(AddThemeModel model);
        Task<bool> UpdateTheme(long id, AddThemeModel model);
        Task<bool> DeleteTheme(long id);
    }
}
