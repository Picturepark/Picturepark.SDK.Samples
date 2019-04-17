using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Picturepark.PressPortal.Demo.Contracts;
using Picturepark.SDK.V1.Contract;
using Picturepark.PressPortal.Demo.Services;
using Picturepark.SDK.V1.Contract.Extensions;

namespace Picturepark.PressPortal.Demo.Repository
{
    public class PressReleaseRepository : IPressReleaseRepository
    {
        private readonly IPictureparkAccessTokenService _client;

        public PressReleaseRepository(IPictureparkAccessTokenService client)
        {
            _client = client;
        }

        public async Task<List<ContentItem<PressKits>>> List(string pageToken, int limit, string searchString)
        {
            var searchResult = await _client.Content.SearchAsync(new ContentSearchRequest
            {
                PageToken = pageToken,
                Limit = limit,
                SearchString = searchString,
                Filter = new AndFilter
                {
                    Filters = new List<FilterBase>
                    {
                        // Limit to PressRelease content
                        FilterBase.FromExpression<Content>(i => i.ContentSchemaId, nameof(PressKits)),

						// Filter out future publications
						new DateRangeFilter
                        {
                            Field = "pressKits.releaseDate",
                            Range = new DateRange
                            {
                                To = "now"
                            }
                        }
                    }
                },
                Sort = new List<SortInfo>
                {
                    new SortInfo { Field = "pressKits.releaseDate", Direction = SortDirection.Desc }
                }
            });

            // Fetch details
            var contents = searchResult.Results.Any()
                ? await _client.Content.GetManyAsync(searchResult.Results.Select(i => i.Id),
                    new[]
                    {
                        ContentResolveBehavior.Content,
                        ContentResolveBehavior.Owner
                    })
                : new List<ContentDetail>();

            // Convert to C# poco
            var pressPortals = contents.AsContentItems<PressKits>().ToList();

            return pressPortals;
        }

        public async Task<ContentItem<PressKits>> Get(string id)
        {
            var content = await _client.Content.GetAsync(id, new[] { ContentResolveBehavior.Content, ContentResolveBehavior.Owner });

            return content.AsContentItem<PressKits>();
        }

        public async Task<List<SearchResult>> Search(string pageToken, int limit, string searchString)
        {
            var result = await List(pageToken, limit, searchString);

            return result.Select(i => new SearchResult { Id = i.Id, Title = i.Content.Headline.GetTranslation(), Description = i.Content.Lead.GetTranslation() }).ToList();
        }
    }
}
