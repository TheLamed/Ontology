using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication.Models.Entities;
using WebApplication.Models.Theme;

namespace WebApplication.Interfaces.Admin
{
    public interface IThemeService
    {
        Task<List<ThemeModel>> GetThemes();
        Task<bool> AddTheme(AddThemeModel model);
        Task<bool> UpdateTheme(long id, AddThemeModel model);
        Task<bool> EditChildrenTheme(long id, List<long> children);
        Task<bool> DeleteTheme(long id);
    }
}
