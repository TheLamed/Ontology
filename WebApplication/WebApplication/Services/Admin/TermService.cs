using Neo4j.Driver.V1;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using WebApplication.Interfaces.Admin;
using WebApplication.Models;
using WebApplication.Models.Entities;

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

        public async Task<bool> AddTerm(EditTermModel model)
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

                if (model.Themes != null)
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

        public async Task<bool> UpdateTerm(long id, EditTermModel model)
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

        public async Task<PagingList<TermModel>> GetTerms(int pn = 0, int ps = 10, string sort = "asc")
        {
            using (var session = _db.GetSession())
            {
                var result = await session.RunAsync(
                    string.Format(_transactions.GetTerm(sort), pn * ps, ps)
                );

                var list = new List<TermModel>();

                while (await result.FetchAsync())
                {
                    var term = new Term(result.Current[0] as INode);
                    var themes = (result.Current[1] as IEnumerable<object>)?
                        .Select(v => new Theme(v as INode))
                        .ToList();

                    var model = new TermModel(term, themes);
                    list.Add(model);
                }

                var countResult = await session.RunAsync(
                    _transactions.GetTermCount()
                );
                var record = await countResult.SingleAsync();
                var count = (long)(record.Values.Single().Value);

                return new PagingList<TermModel>()
                {
                    Items = list,
                    PageNumber = pn,
                    PageSize = ps,
                    TotalCount = count
                };
            }
        }

        //public async Task<bool> ReadTermsFromJSON()
        //{
        //    var text = await File.ReadAllTextAsync("terms.json");
        //    var list = JsonConvert.DeserializeObject<List<EditTermModel>>(text);

        //    foreach (var item in list)
        //    {
        //        item.Themes = new List<long>(){ 53 };
        //        await AddTerm(item);
        //    }

        //    return true;
        //}

        #endregion
    }
}
