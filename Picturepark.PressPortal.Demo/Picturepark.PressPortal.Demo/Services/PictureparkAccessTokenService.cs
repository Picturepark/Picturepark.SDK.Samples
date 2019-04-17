using Picturepark.SDK.V1;

namespace Picturepark.PressPortal.Demo.Services
{
    public class PictureparkAccessTokenService : PictureparkService, IPictureparkAccessTokenService
	{
		public PictureparkAccessTokenService(IPictureparkAccessTokenServiceSettings settings) : base(settings)
		{

		}
	}
}
