using Neo4j.Driver.V1;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using WebApplication.Interfaces;
using WebApplication.Models;
using WebApplication.Models.Content;
using WebApplication.Models.Entities;

namespace WebApplication.Services
{
    public class ContentService : IContentService
    {
        #region Private Members

        private DBService _db;
        private IWordComparisonService _wordComparison;
        private ContentTransactionsService _transactions;

        private Regex _seperators;

        #endregion

        #region Constructor

        public ContentService
        (
            DBService db,
            IWordComparisonService wordComparison,
            ContentTransactionsService transactions
        )
        {
            _db = db;
            _wordComparison = wordComparison;
            _transactions = transactions;

            _seperators = new Regex("[.,?!:;'\"_@#$%^&*=+()\\[\\]{}~\t\n-]");
        }

        #endregion

        #region IContentService implementation

        public async Task<TermViewModel> ViewTerm(long id)
        {
            using (var session = _db.GetSession())
            {
                var result = await session.RunAsync(
                    string.Format(_transactions.GetTermView(), id)
                );

                var record = await result.SingleAsync();

                Term term = null;

                if (record[0] is INode node)
                    term = new Term(node);
                else
                    return null;

                var themes = (record[1] as IEnumerable<object>)?
                    .Select(v => new Theme(v as INode))
                    .ToList();

                var relatedTerms = (record[2] as IEnumerable<object>)?
                    .Select(v => new Term(v as INode))
                    .ToList();

                var response = new TermViewModel()
                {
                    Id = term.Id,
                    Name = term.Name,
                    Source = term.Source,
                    //Description = term.Description,
                };

                response.Themes = themes?.Select(v => new IdValueModel()
                {
                    Id = v.Id,
                    Value = v.Name
                }).ToList();

                response.RelatedTerms = relatedTerms?.Select(v => new TermSimpleModel()
                {
                    Id = v.Id,
                    Name = v.Name,
                    Description = v.Description,
                }).ToList();

                response.Description = await IndexDescription(term, relatedTerms);

                return response;
            }
        }

        public async Task<PagingList<TermContentModel>> GetContent(int pn = 0, int ps = 10, string sort = "asc", string name = null, string themes = null)
        {
            using (var session = _db.GetSession())
            {
                IEnumerable<long> themeIds = null;
                if(themes != null)
                {
                    themeIds = themes.Split(',')
                        .SelectMany(v =>
                        {
                            try
                            {
                                var id = Convert.ToInt64(v);
                                return new List<long>() { id };
                            }
                            catch (Exception)
                            {
                                return new List<long>();
                            }
                        });
                }

                var result = await session.RunAsync(
                    string.Format(_transactions.GetContent(sort, name, themeIds), pn, ps),
                    new { Name = name }
                );

                var list = new List<TermContentModel>();

                while (await result.FetchAsync())
                {
                    var term = new Term(result.Current[0] as INode);
                    var themesList = (result.Current[1] as IEnumerable<object>)?
                        .Select(v => new Theme(v as INode))
                        .ToList();

                    var model = new TermContentModel(term, themesList);
                    list.Add(model);
                }

                var countResult = await session.RunAsync(
                    _transactions.GetContentCount(sort, name, themeIds),
                    new { Name = name }
                );
                var countRecord = await countResult.SingleAsync();
                var totalCount = (long)(countRecord.Values.Single().Value);

                return new PagingList<TermContentModel>()
                {
                    Items = list,
                    TotalCount = totalCount,
                    PageNumber = pn,
                    PageSize = ps
                };
            }
        }

        public async Task<List<TermContentModel>> GetRandomTerms(int count = 10)
        {
            using (var session = _db.GetSession())
            {
                var result = await session.RunAsync(
                    string.Format(_transactions.GetRandomTerms(), count)
                );

                var list = new List<TermContentModel>();

                while (await result.FetchAsync())
                {
                    var term = new Term(result.Current[0] as INode);
                    var themes = (result.Current[1] as IEnumerable<object>)?
                        .Select(v => new Theme(v as INode))
                        .ToList();

                    var model = new TermContentModel(term, themes);
                    list.Add(model);
                }

                return list;
            }
        }

        public async Task<List<IdValueModel>> GetThemes()
        {
            using (var session = _db.GetSession())
            {
                var result = await session.RunAsync(
                    _transactions.GetThemes()
                );

                var list = new List<IdValueModel>();

                while (await result.FetchAsync())
                {
                    var theme = new Theme(result.Current[0] as INode);

                    var model = new IdValueModel()
                    {
                        Id = theme.Id,
                        Value = theme.Name
                    };

                    list.Add(model);
                }

                return list;
            }
        }


        #endregion

        #region Private Members

        private async Task<string> IndexDescription(Term term, IEnumerable<Term> relatedTerms)
        {
            var output = term.Description;

            var description = _seperators
                .Replace(term.Description, " ")
                .Split(" ".ToCharArray(), StringSplitOptions.RemoveEmptyEntries);

            foreach (var item in relatedTerms)
            {
                var length = item.Name.Split(" ".ToCharArray(), StringSplitOptions.RemoveEmptyEntries).Length;
                var words = new List<string>();

                for (int i = 0; i < description.Length - length; i++)
                {
                    var word = string.Join(" ", description.Skip(i).Take(length));

                    if (item.IsFullMatch)
                    {
                        if(item.Name == word)
                            words.Add(word);
                    }
                    else
                    {
                        var value = _wordComparison.Compare(item.Name, word);
                        if (_wordComparison.IsSatisfy(value))
                            words.Add(word);
                    }
                }

                foreach (var word in words)
                    output = output.Replace(word, $"<term id=\"{item.Id}\">" + word + "</term>");
            }

            var termRegex = new Regex(@"(<term id=""\d+"">)+");
            var termEndRegex = new Regex(@"(</term>)+");
            var idRegex = new Regex(@"\d+");

            output = termEndRegex.Replace(output, "</term>");

            output = termRegex.Replace(output, v =>
            {
                var ids = idRegex.Matches(v.Value);
                var idsString = string.Join(", ", ids.Select(s => s.Value));
                return $"<term id=\"{idsString}\">";
            });

            return output;
        }

        #endregion
    }
}
