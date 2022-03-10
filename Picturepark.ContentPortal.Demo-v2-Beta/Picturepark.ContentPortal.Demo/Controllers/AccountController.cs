using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Picturepark.ContentPortal.Demo.Contract;

namespace Picturepark.ContentPortal.Demo.Controllers
{
    public class AccountController : Controller
    {
        internal static readonly string LoginPath = "/account/login";

        [HttpGet]
        public IActionResult Login(string returnUrl = null)
        {

            if (!Url.IsLocalUrl(returnUrl)) returnUrl = "/";

            var props = new AuthenticationProperties
            {
                RedirectUri = returnUrl,
                Items = { { "localUrl", $"{HttpContext.Request.Scheme}://{HttpContext.Request.Host}" } }
            };

            return Challenge(props, "oidc");
        }

        public IActionResult Denied(string returnUrl = null)
        {
            return View();
        }

        public IActionResult Logout()
        {
            return SignOut("Cookies", "oidc");
        }
    }
}
