using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Picturepark.ContentPortal.Demo.Contract;

namespace Picturepark.ContentPortal.Demo.Controllers
{
    [ApiController]
    public class AppController : ControllerBase
    {
        private readonly IConfiguration Configuration;

        public AppController(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        [Route("app/info")]
        public IActionResult Info()
        {
            var appInfo = Configuration.GetSection("AppInfo").Get<AppInfo>();

            return Ok(appInfo);
        }
    }
}