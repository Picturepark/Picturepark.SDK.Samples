using System.Collections.Generic;

namespace Picturepark.ContentPortal.Demo.Contract
{
    public class PictureparkConfiguration
    {
        public string ContactEmail { get; set; }

        public string ApplicationBaseUrl { get; set; }

        public string FrontendBaseUrl { get; set; }

        public string ApiServer { get; set; }

        public string IdentityServer { get; set; }

        public string RedirectUrl { get; set; }

        public string CustomerId { get; set; }

        public string ClientId { get; set; }

        public string ClientSecret { get; set; }

        public List<string> Scopes { get; set; } = new List<string>();

        public string CustomerAlias { get; set; }

        public string AccessToken { get; set; }

        public string[] AutoAssignUserRoleIds { get; set; }

        public string UserRegistrationAccessToken { get; set; }

    }
}
