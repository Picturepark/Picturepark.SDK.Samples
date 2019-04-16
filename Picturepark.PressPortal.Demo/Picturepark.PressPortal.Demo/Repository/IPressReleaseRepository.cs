using Picturepark.PressPortal.Demo.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Picturepark.SDK.V1.Contract;

namespace Picturepark.PressPortal.Demo.Repository
{
	public interface IPressReleaseRepository : IRepository<ContentItem<PressKits>>
	{
	}
}
