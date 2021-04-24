using Neo4j.Driver.V1;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using WebApplication.Interfaces;
using WebApplication.Models;
using WebApplication.Models.Entities;
using WebApplication.Models.TextProcessing;

namespace WebApplication.Services
{
    public class TextProcessingService
    {
        #region Private Members

        private DBService _db;
        private IWordComparisonService _wordComparison;
        private TextPrecessingTransactionsService _transactions;

        private List<SDIOTerm> SDIOTerms;

        #endregion

        #region Constructor

        public TextProcessingService
        (
            DBService db,
            IWordComparisonService wordComparison,
            TextPrecessingTransactionsService transactions
        )
        {
            _db = db;
            _wordComparison = wordComparison;
            _transactions = transactions;

            SDIOTerms = new List<SDIOTerm>();
        }

        #endregion

        #region Methods

        /// <summary>
        /// Semantic Distance In Ontology
        /// </summary>
        public async Task<decimal> SDIO(long from, long to)
        {
            var sdio = SDIOTerms
                .Where(v => (v.From == from && v.To == to) || (v.From == to && v.To == from))
                .FirstOrDefault();

            if(sdio != null)
            {
                return sdio.L;
            }

            using (var session = _db.GetSession())
            {
                var dictionary = new Dictionary<long, long>();

                for (int i = 0; i < 4; i++) //MAX COUNT OF TRANSITIONS NODES = 3
                {
                    var countResult = await session.RunAsync(
                        _transactions.GetCountOfTransitions(from, to, i)
                    );
                    var record = await countResult.SingleAsync();
                    var count = (long)(record.Values.Single().Value);
                    dictionary.Add(i + 1, count);
                }

                var N = 0m;

                foreach (var item in dictionary.Keys)
                {
                    N += dictionary[item] / item;
                }

                var L = 1m / N;

                SDIOTerms.Add(new SDIOTerm
                {
                    L = L,
                    To = to,
                    From = from
                });

                return L;
            }
        }

        /// <summary>
        /// Return text splited to paragraphs, sentences and with terms
        /// </summary>
        public async Task<StructuredText> GetStructuredText(string text)
        {
            var response = new StructuredText
            {
                OriginalText = text,
                Paragraphs = new List<StructuredParagraph>(),
                Terms = new List<Term>()
            };

            var paragraphsSeperators = new Regex(@"[\n]");
            var sentenceSeperators = new Regex(@"[.!?]");

            var paragraphsTexts = paragraphsSeperators.Split(text).ToList();

            // Поділ на речення, абзаци і тд
            foreach (var paragraphText in paragraphsTexts)
            {
                var paragraph = new StructuredParagraph
                {
                    OriginalText = paragraphText,
                    Sentences = new List<StructuredSentence>(),
                    Terms = new List<Term>()
                };

                var sentenceTexts = sentenceSeperators.Split(paragraphText);

                foreach (var sentenceText in sentenceTexts)
                {
                    var sentence = new StructuredSentence
                    {
                        OriginalText = sentenceText,
                        Terms = new List<Term>()
                    };

                    paragraph.Sentences.Add(sentence);
                }

                response.Paragraphs.Add(paragraph);
            }

            //Отримання всіх термінів
            using (var session = _db.GetSession())
            {
                var result = await session.RunAsync(_transactions.GetTerms());

                var sentences = response.Paragraphs.SelectMany(v => v.Sentences).ToList();
                while (await result.FetchAsync())
                {
                    var item = new Term(result.Current[0] as INode);

                    foreach (var sentance in sentences)
                    {
                        if(IsUsing(item, sentance.OriginalText))
                        {
                            sentance.Terms.Add(item);
                        }
                    }
                }
            }

            foreach (var item in response.Paragraphs)
            {
                item.Terms = item.Sentences.SelectMany(v => v.Terms).ToList();
            }

            response.Terms = response.Paragraphs.SelectMany(v => v.Terms).ToList();

            return response;
        }

        #region TEXT

        /// <summary>
        /// Semantic Distance In Text
        /// </summary>
        public async Task<decimal> SDIT(long from, long to, StructuredText text)
        {
            var L = await SDIO(from, to);

            var Ns = new Dictionary<long, long>()
            {
                { 0, 0 }, // речення
                { 2, 0 }, // параграф
                { 4, 0 }, // текст
            };

            var textParagraphs = new List<StructuredParagraph>();
            textParagraphs.AddRange(text.Paragraphs);

            foreach (var paragraph in text.Paragraphs)
            {
                var paragraphSentances = new List<StructuredSentence>();
                paragraphSentances.AddRange(paragraph.Sentences);

                foreach (var sentence in paragraph.Sentences)
                {
                    if(sentence.Terms.Any(v => v.Id == from) && sentence.Terms.Any(v => v.Id == to))
                    {
                        Ns[0] += sentence.Terms.Count(v => v.Id == from) * sentence.Terms.Count(v => v.Id == to);
                    }

                    paragraphSentances.Remove(sentence);
                    var sentencesTerms = paragraphSentances.SelectMany(v => v.Terms);
                    Ns[2] += sentence.Terms.Count(v => v.Id == from) * sentencesTerms.Count(v => v.Id == to)
                        + sentence.Terms.Count(v => v.Id == to) * sentencesTerms.Count(v => v.Id == from);
                }

                textParagraphs.Remove(paragraph);
                var paragraphsTerms = textParagraphs.SelectMany(v => v.Terms);
                Ns[4] += paragraph.Terms.Count(v => v.Id == from) * paragraphsTerms.Count(v => v.Id == to)
                    + paragraph.Terms.Count(v => v.Id == to) * paragraphsTerms.Count(v => v.Id == from);
            }

            var Re = ((Ns[0] * 1m) / (L + 0m)) + ((Ns[2] * 1m) / (L + 2m)) + ((Ns[4] * 1m) / (L + 4m));
            //var R = 1m / Re;

            return Re;
        }

        /// <summary>
        /// Semantic Size of the Text
        /// </summary>
        public async Task<decimal> SSOTT(StructuredText text)
        {
            var terms = text.Terms.Distinct(new TermComparer()).ToList();
            var otherTerms = terms.ToList();

            var Re = 0m;

            foreach (var from in terms)
            {
                otherTerms.Remove(from);

                foreach (var to in otherTerms)
                {
                    Re += await SDIT(from.Id, to.Id, text);
                }
            }

            if (Re == 0)
                return 0;

            //var R = 1m / Re;

            return Re;
        }

        #endregion
        
        #region PARAGRAPH

        /// <summary>
        /// Semantic Distance In Paragraph
        /// </summary>
        public async Task<decimal> SDIP(long from, long to, StructuredParagraph paragraph)
        {
            var L = await SDIO(from, to);

            var Ns = new Dictionary<long, long>()
            {
                { 0, 0 }, // речення
                { 2, 0 }, // параграф
            };

            var paragraphSentances = new List<StructuredSentence>();
            paragraphSentances.AddRange(paragraph.Sentences);

            foreach (var sentence in paragraph.Sentences)
            {
                if(sentence.Terms.Any(v => v.Id == from) && sentence.Terms.Any(v => v.Id == to))
                {
                    Ns[0] += sentence.Terms.Count(v => v.Id == from) * sentence.Terms.Count(v => v.Id == to);
                }

                paragraphSentances.Remove(sentence);
                var sentencesTerms = paragraphSentances.SelectMany(v => v.Terms);
                Ns[2] += sentence.Terms.Count(v => v.Id == from) * sentencesTerms.Count(v => v.Id == to)
                    + sentence.Terms.Count(v => v.Id == to) * sentencesTerms.Count(v => v.Id == from);
            }


            var Re = ((Ns[0] * 1m) / (L + 0m)) + ((Ns[2] * 1m) / (L + 2m));
            //var R = 1m / Re;

            return Re;
        }

        /// <summary>
        /// Semantic Size of the Paragraph
        /// </summary>
        public async Task<decimal> SSOTP(StructuredParagraph paragraph)
        {
            var terms = paragraph.Terms.Distinct(new TermComparer()).ToList();
            var otherTerms = terms.ToList();

            var Re = 0m;

            foreach (var from in terms)
            {
                otherTerms.Remove(from);

                foreach (var to in otherTerms)
                {
                    Re += await SDIP(from.Id, to.Id, paragraph);
                }
            }

            if (Re == 0)
                return 0;

            //var R = 1m / Re;

            return Re;
        }

        #endregion
        
        #region SENTENCE

        /// <summary>
        /// Semantic Distance In Sentence
        /// </summary>
        public async Task<decimal> SDIS(long from, long to, StructuredSentence sentence)
        {
            var L = await SDIO(from, to);

            var Ns = new Dictionary<long, long>()
            {
                { 0, 0 }, // речення
            };

            if(sentence.Terms.Any(v => v.Id == from) && sentence.Terms.Any(v => v.Id == to))
            {
                Ns[0] += sentence.Terms.Count(v => v.Id == from) * sentence.Terms.Count(v => v.Id == to);
            }

            var Re = ((Ns[0] * 1m) / (L + 0m));
            //var R = 1m / Re;

            return Re;
        }

        /// <summary>
        /// Semantic Size of the SENTENCE
        /// </summary>
        public async Task<decimal> SSOTS(StructuredSentence sentence)
        {
            var terms = sentence.Terms.Distinct(new TermComparer()).ToList();
            var otherTerms = terms.ToList();

            var Re = 0m;

            foreach (var from in terms)
            {
                otherTerms.Remove(from);

                foreach (var to in otherTerms)
                {
                    Re += await SDIS(from.Id, to.Id, sentence);
                }
            }

            if (Re == 0)
                return 0;

            //var R = 1m / Re;

            return Re;
        }

        #endregion

        public async Task<AnalysedTextModel> TextAnalysis(TextAnalizationRequest model)
        {
            var response = new AnalysedTextModel();

            var structuredText = await GetStructuredText(model.Text);

            response.SemanticSize = await SSOTT(structuredText);

            if (model.IncludeParagraphAnalization)
            {
                response.Paragraphs = new List<AnalysedParagraphModel>();

                foreach (var paragraph in structuredText.Paragraphs)
                {
                    var responseParagraph = new AnalysedParagraphModel();

                    responseParagraph.SemanticSize = await SSOTP(paragraph);

                    if (model.IncludeSentenceAnalization)
                    {
                        responseParagraph.Sentences = new List<AnalysedSentenceModel>();

                        foreach (var sentence in paragraph.Sentences)
                        {
                            var responseSenetence = new AnalysedSentenceModel();

                            responseSenetence.SemanticSize = await SSOTS(sentence);

                            if (model.IncludeTermsShowing)
                            {
                                var sentenceTerms = sentence.Terms
                                    .Distinct(new TermComparer())
                                    .ToList();

                                responseSenetence.Text = await IndexTextAsync(sentence.OriginalText, sentenceTerms);
                            }

                            responseParagraph.Sentences.Add(responseSenetence);
                        }
                    }

                    if (model.IncludeTermsShowing)
                    {
                        var paragraphTerms = paragraph.Terms
                            .Distinct(new TermComparer())
                            .ToList();

                        responseParagraph.Text = await IndexTextAsync(paragraph.OriginalText, paragraphTerms);
                    }

                    response.Paragraphs.Add(responseParagraph);
                }
            }

            if (model.IncludeTermsShowing)
            {
                var textTerms = structuredText.Terms
                    .Distinct(new TermComparer())
                    .ToList();

                response.Text = await IndexTextAsync(structuredText.OriginalText, textTerms);
            }

            response.Terms = structuredText.Terms
                    .Distinct(new TermComparer())
                    .Select(v => new TermModel(v))
                    .ToList();

            return response;
        }

        #endregion

        #region Private Methods

        private bool IsUsing(Term term, string text)
        {
            if (term.IsFullMatch)
                return text.Contains(term.Name);

            var seperators = new Regex("[.,?!:;'\"_@#$%^&*=+()\\[\\]{}~\t\n-]");

            var length = term.Name.Split(" ".ToCharArray(), StringSplitOptions.RemoveEmptyEntries).Length;

            var descript = seperators.Replace(text, " ");
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

        private async Task<string> IndexTextAsync(string text, IEnumerable<Term> relatedTerms)
        {
            return await Task.Run(() => IndexText(text, relatedTerms));
        }

        private string IndexText(string text, IEnumerable<Term> relatedTerms)
        {
            var output = text;
            var seperators = new Regex("[.,?!:;'\"_@#$%^&*=+()\\[\\]{}~\t\n-]");

            var description = seperators
                .Replace(text, " ")
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
                        if (item.Name == word)
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
