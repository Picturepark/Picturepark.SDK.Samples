using Picturepark.PressPortal.Demo.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Picturepark.PressPortal.Demo.Repository
{
	public interface IRepository<T>
	{
		Task<List<T>> List(string pageToken, int limit, string searchString);

		Task<List<SearchResult>> Search(string pageToken, int limit, string searchString);

		Task<T> Get(string id);
	}
}
