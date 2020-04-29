using Neo4j.Driver.V1;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication.Interfaces.Admin;
using WebApplication.Models.Entities;
using WebApplication.Models.Themes;

namespace WebApplication.Services.Admin
{
    public class ThemeService : IThemeService
    {
        #region Private Members

        private DBService _db;
        private AdminTransactionsService _transactions;

        #endregion

        #region Constructor

        public ThemeService
        (
            DBService db,
            AdminTransactionsService transactions
        )
        {
            _db = db;
            _transactions = transactions;
        }

        #endregion

        #region IThemeService implementation

        public async Task<bool> AddTheme(AddThemeModel model)
        {
            using(var session = _db.GetSession())
            {
                var result = await session.RunAsync(_transactions.AddTheme(), model);
                var record = await result.SingleAsync();

                long id;

                if (!(record.Values.Single().Value is INode node))
                    return false;
                else
                    id = node.Id;

                if(model.Parents != null)
                    foreach (var item in model.Parents)
                    {
                        var relresult = await session.RunAsync(
                            string.Format(_transactions.AddParentTheme(), id, item), 
                            model);
                    }
            }

            return true;
        }

        public async Task<bool> DeleteTheme(long id)
        {
            using (var session = _db.GetSession())
            {
                var result = await session.RunAsync(
                    string.Format(_transactions.DeleteTheme(), id)
                );
            }

            return true;
        }

        public async Task<List<ThemeModel>> GetThemes()
        {
            using (var session = _db.GetSession())
            {
                var list = new List<ThemeModel>();

                var result = await session.RunAsync(_transactions.GetThemes());

                while (await result.FetchAsync())
                {
                    var theme = new Theme(result.Current[0] as INode);
                    var model = new ThemeModel(theme);

                    var exist = list.Find(v => v.Id == model.Id);
                    if (exist != null) model = exist;
                    else list.Add(model);

                    model.CountOfTerms = (long)result.Current[2];

                    if (result.Current[1] != null)
                    {
                        var parent = new Theme(result.Current[1] as INode);
                        model.Parents.Add(new ThemeModel(parent) { Parents = null });
                    }
                }

                return list;
            }
        }

        public async Task<bool> UpdateTheme(long id, AddThemeModel model)
        {
            using (var session = _db.GetSession())
            {
                var result = await session.RunAsync(
                    string.Format(_transactions.UpdateTheme(), id), 
                    model
                );
                var record = await result.SingleAsync();

                if (!(record.Values.Single().Value is INode))
                    return false;
            }

            return true;
        }

        #endregion
    }
}
