using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Picturepark.PressPortal.Demo.Contracts;
using Picturepark.PressPortal.Demo.Repository;

namespace Picturepark.PressPortal.Demo.Controllers
{
	public class SearchViewModel
	{
		public string SearchString { get; set; }

		public List<SearchResult> SearchResults { get; set; }
	}

	public class SearchController : Controller
	{
		private readonly IPressReleaseRepository _pressReleaseRepository;

		public SearchController(IPressReleaseRepository pressReleaseRepository)
		{
			_pressReleaseRepository = pressReleaseRepository;
		}

		public async Task<IActionResult> Index([FromQuery]string search)
		{
			var result = await _pressReleaseRepository.Search(null, 10, search);

			var viewModel = new SearchViewModel
			{
				SearchString = search,
				SearchResults = result
			};

			return View(viewModel);
		}
	}
}