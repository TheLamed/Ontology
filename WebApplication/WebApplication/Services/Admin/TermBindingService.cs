using Neo4j.Driver.V1;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using WebApplication.Interfaces;
using WebApplication.Interfaces.Admin;
using WebApplication.Models;
using WebApplication.Models.Entities;

namespace WebApplication.Services.Admin
{
    public class TermBindingService : ITermBindingService
    {
        #region Private Members

        private DBService _db;
        private AdminTransactionsService _transactions;
        private IWordComparisonService _wordComparison;
        private ITermService _termService;

        private bool _isProcessing;
        private long _unindexedCount;
        private long _countForIndex;
        private long _countForIndexDone;
        private long _indexedCount;

        private Regex seperators;

        #endregion

        #region Constructor

        public TermBindingService
        (
            DBService db,
            AdminTransactionsService transactions,
            IWordComparisonService wordComparison,
            ITermService termService
        )
        {
            _db = db;
            _transactions = transactions;
            _wordComparison = wordComparison;
            _termService = termService;

            _isProcessing = false;
            _unindexedCount = 0;
            _indexedCount = 0;
            _countForIndex = 0;
            _countForIndexDone = 0;

            seperators = new Regex("[.,?!:;'\"_@#$%^&*=+()\\[\\]{}~\t\n-]");
        }

        #endregion

        #region ITermBindingService implementation

        public async Task StartProcessing()
        {
            if (_isProcessing) return;

            _isProcessing = true;
            _unindexedCount = 0;
            _indexedCount = 0;

            using (var session = _db.GetSession())
            {
                var countResult = await session.RunAsync(_transactions.GetUnindexedTermsCount());
                var countRecord = await countResult.SingleAsync();
                _unindexedCount = (long)(countRecord.Values.Single().Value);

                var result = await session.RunAsync(_transactions.GetUnindexedTerms());
                
                while (await result.FetchAsync())
                {
                    var term = new Term(result.Current[0] as INode);
                    await Index(term);

                    term.Status = Status.Indexed;
                    await session.RunAsync(string.Format(_transactions.UpdateTermStatus(), term.Id, (int)Status.Indexed));

                    _indexedCount++;
                }
            }

            _isProcessing = false;
            _unindexedCount = 0;
            _indexedCount = 0;
            _countForIndex = 1;
            _countForIndexDone = 0;
        }

        public async Task<BindingInfoModel> GetBindingInfo()
        {
            var info = new BindingInfoModel();

            info.InProgress = _isProcessing;
            try
            {
                using (var session = _db.GetSession())
                {
                    var countResult = await session.RunAsync(_transactions.GetTotalTermsCount());
                    var countRecord = await countResult.SingleAsync();
                    info.TotalCount = (long)(countRecord.Values.Single().Value);

                    var unindexedResult = await session.RunAsync(_transactions.GetUnindexedTermsCount());
                    var unindexedRecord = await unindexedResult.SingleAsync();
                    info.UnindexedCount = (long)(unindexedRecord.Values.Single().Value);
                }

                if (_isProcessing)
                    info.Percent = ((1.0 * _indexedCount * _countForIndex + _countForIndexDone * _countForIndex) / (1.0 * _unindexedCount * _countForIndex)) * 100;
                else
                    info.Percent = 100 - (1.0 * info.UnindexedCount / info.TotalCount * 100);
            }
            catch (Exception)
            {
                return info;
            }

            return info;
        }

        #endregion

        #region Private Members

        private async Task Index(Term term)
        {
            _countForIndexDone = 0;

            using (var session = _db.GetSession())
            {
                var countResult = await session.RunAsync(string.Format(_transactions.GetOtherTermsCount(), term.Id));
                var countRecord = await countResult.SingleAsync();
                _countForIndex = (long)(countRecord.Values.Single().Value);

                var result = await session.RunAsync(string.Format(_transactions.GetOtherTerms(), term.Id));

                while (await result.FetchAsync())
                {
                    var item = new Term(result.Current[0] as INode);

                    if (!await HasRelation(item, term))
                    {
                        var termInItem = IsUsing(term, item);
                        if (termInItem)
                            await session.RunAsync(string.Format(_transactions.AddUsed(), item.Id, term.Id));
                    }

                    if (!await HasRelation(term, item))
                    {
                        var itemInTerm = IsUsing(item, term);
                        if (itemInTerm)
                            await session.RunAsync(string.Format(_transactions.AddUsed(), term.Id, item.Id));
                    }

                    _countForIndex++;
                }
            }
        }

        private async Task<bool> HasRelation(Term from, Term to)
        {
            using (var session = _db.GetSession())
            {
                var result = await session.RunAsync(string.Format(_transactions.IsRelation(), from.Id, to.Id));
                var record = await result.SingleAsync();

                return Convert.ToBoolean(record.Values.Values.SingleOrDefault());
            }
        }

        private bool IsUsing(Term term, Term description)
        {
            if (term.IsFullMatch)
                return description.Description.Contains(term.Name);

            var length = term.Name.Split(" ".ToCharArray(), StringSplitOptions.RemoveEmptyEntries).Length;

            var descript = seperators.Replace(description.Description, " ");
            var words = descript.Split(" ".ToCharArray(), StringSplitOptions.RemoveEmptyEntries);

            for (int i = 0; i < words.Length - length; i++)
            {
                var item = words[i];
                for (int j = i + 1; j < length; j++)
                    item += " " + words[j];

                var value = _wordComparison.Compare(term.Name, item);
                if (_wordComparison.IsSatisfy(value))
                    return true;
            }

            return false;
        }

        #endregion
    }
}
