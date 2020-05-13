using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication.Models.Content;

namespace WebApplication.Interfaces
{
	public interface IContentService
	{
		Task<TermViewModel> ViewTerm(long id);
		Task<List<TermContentModel>> GetContent
		(
			int pn = 0,
			int ps = 10,
			string sort = "asc",
			string name = null,
			string themes = null
		);
		Task<List<TermContentModel>> GetRandomTerms(int count = 10);
	}
}
