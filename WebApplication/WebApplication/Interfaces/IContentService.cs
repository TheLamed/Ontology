using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication.Models;
using WebApplication.Models.Content;

namespace WebApplication.Interfaces
{
	public interface IContentService
	{
		Task<TermViewModel> ViewTerm(long id);
		Task<PagingList<TermContentModel>> GetContent
		(
			int pn = 0,
			int ps = 10,
			string sort = "asc",
			string name = null,
			string themes = null
		);
		Task<List<TermContentModel>> GetRandomTerms(int count = 10);
		Task<List<IdValueModel>> GetThemes();
	}
}
