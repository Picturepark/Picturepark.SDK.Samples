using Picturepark.PressPortal.Demo.Contracts;
using Picturepark.SDK.V1.Contract;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Picturepark.PressPortal.Demo.Helpers
{
	public interface IServiceHelper
	{
		Task EnsureSchemaExists<T>(Action<SchemaDetail> beforeCreateOrUpdateAction, bool update);
	}
}
