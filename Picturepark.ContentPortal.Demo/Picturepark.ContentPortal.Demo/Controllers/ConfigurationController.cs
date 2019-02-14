using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Picturepark.ContentPortal.Demo.Contract;

namespace Picturepark.ContentPortal.Demo.Controllers
{
    [Route("configuration")]
    public class ConfigurationController : Controller
    {
        private readonly IConfiguration _configuration;

        public ConfigurationController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet("client")]
        public IActionResult GetClientConfiguration()
        {
            var clientConfiguration = _configuration.GetSection("ClientConfiguration").Get<ClientConfiguration>();

            return Ok(clientConfiguration);
        }
    }
}
