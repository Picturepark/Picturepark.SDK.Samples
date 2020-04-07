using System.Reflection;
using Microsoft.AspNetCore.Mvc;
using Picturepark.ContentPortal.Demo.Contract;

namespace Picturepark.ContentPortal.Demo.Controllers
{
    [ApiController]
    public class AppController : ControllerBase
    {
       [Route("app/info")]
        public IActionResult Info()
        {
            var version = Assembly.GetExecutingAssembly().GetName().Version.ToString();
            return Ok(new AppInfo { Version = version });
        }
    }
}