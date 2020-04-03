using Neo4j.Driver.V1;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication.Interfaces.Admin;
using WebApplication.Models.Theme;

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

                if (!(record.Values.Single().Value is INode))
                    return false;
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

        public async Task<bool> EditChildrenTheme(long id, List<long> children)
        {
            using (var session = _db.GetSession())
            {


                var result = await session.RunAsync(
                    string.Format(_transactions.DeleteTheme(), id)
                );
            }

            return true;
        }

        public Task<List<ThemeModel>> GetThemes()
        {
            throw new NotImplementedException();
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
