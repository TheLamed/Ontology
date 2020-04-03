using Neo4j.Driver.V1;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication.Interfaces.Admin;
using WebApplication.Models;

namespace WebApplication.Services.Admin
{
    public class TermService : ITermService
    {
        #region Private Members

        private DBService _db;
        private AdminTransactionsService _transactions;

        #endregion

        #region Constructor

        public TermService
        (
            DBService db,
            AdminTransactionsService transactions
        )
        {
            _db = db;
            _transactions = transactions;
        }

        #endregion

        #region ITermService implementation

        public async Task<bool> AddTerm(TermModel model)
        {
            using (var session = _db.GetSession())
            {
                var result = await session.RunAsync(_transactions.AddTerm(model), model);
                var record = await result.SingleAsync();

                long nodeId;
                if (!(record.Values.Single().Value is INode node))
                    return false;
                else
                    nodeId = node.Id;

                if(model.Themes != null)
                    foreach (var item in model.Themes)
                        await session.RunAsync(
                            string.Format(_transactions.AddThemeToTerm(), nodeId, item), 
                            model
                        );
            }

            return true;
        }

        public async Task<bool> DeleteTerm(long id)
        {
            using (var session = _db.GetSession())
            {
                var result = await session.RunAsync(
                    string.Format(_transactions.DeleteTerm(), id)
                );
            }

            return true;
        }

        public async Task<bool> DeleteThemeFromTerm(long tremId, long themeId)
        {
            using (var session = _db.GetSession())
            {
                var result = await session.RunAsync(
                    string.Format(_transactions.DeleteThemeFromTerm(), tremId, themeId)
                );
            }

            return true;
        }

        public async Task<bool> AddThemeToTerm(long tremId, long themeId)
        {
            using (var session = _db.GetSession())
            {
                var result = await session.RunAsync(
                    string.Format(_transactions.AddThemeToTerm(), tremId, themeId)
                );
            }

            return true;
        }

        public async Task<bool> UpdateTerm(long id, TermModel model)
        {
            using (var session = _db.GetSession())
            {
                var result = await session.RunAsync(
                    string.Format(_transactions.UpdateTerm(), id),
                    model
                );
                var record = await result.SingleAsync();

                if (!(record.Values.Single().Value is INode))
                    return false;

                var detach = await session.RunAsync(
                    string.Format(_transactions.DetachTerm(), id)
                );
            }

            return true;
        }

        #endregion
    }
}
