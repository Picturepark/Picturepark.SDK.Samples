using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Newtonsoft.Json;
using Picturepark.PressPortal.Demo.Configuration;
using Picturepark.PressPortal.Demo.Controllers;
using Picturepark.PressPortal.Demo.Services;
using Picturepark.SDK.V1.Contract;

namespace Picturepark.PressPortal.Demo
{
    public class OidcEvents : OpenIdConnectEvents
    {
        private readonly IPictureparkAccessTokenService _cpClient;
        private readonly PictureparkConfiguration _cpConfig;
        private readonly AuthenticationConfiguration _authConfig;
        private readonly AuthorizationConfiguration _authorizationConfig;

        public OidcEvents(IPictureparkAccessTokenService cpClient, AuthenticationConfiguration authConfig, PictureparkConfiguration cpConfig, AuthorizationConfiguration authorizationConfig)
        {
            _cpClient = cpClient;
            _cpConfig = cpConfig;
            _authConfig = authConfig;
            _authorizationConfig = authorizationConfig;
        }

        /// <summary>
        /// Adds all the information needed for communication with IdentityServer
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public override Task RedirectToIdentityProvider(RedirectContext context)
        {
            var tenant = new { id = _authConfig.CustomerId, alias = _authConfig.CustomerAlias };
            context.ProtocolMessage.SetParameter("acr_values", "tenant:" + JsonConvert.SerializeObject(tenant));

            var localUrl = context.Properties.Items["localUrl"];
            context.ProtocolMessage.SetParameter("cp_base_uri", _cpConfig.FrontendBaseUrl);
            context.ProtocolMessage.SetParameter("register_uri", BuildRegisterRedirectUri(localUrl));
            context.ProtocolMessage.SetParameter("terms_uri", BuildTermsOfServiceUri(_cpConfig));

            return Task.CompletedTask;
        }

        private static string BuildTermsOfServiceUri(PictureparkConfiguration cpConfig)
            => new Uri(new Uri(cpConfig.ApplicationBaseUrl), "/service/terms/newest").AbsoluteUri;

        private static string BuildRegisterRedirectUri(string localUrl)
        {
            var query = HttpUtility.ParseQueryString(string.Empty);
            query["redirect"] = $"{localUrl}{AccountController.LoginPath}";

            return $"/terms?{query}";
        }

        /// <summary>
        /// Checks if the user is reviewed and assigns the automatic user roles
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public override async Task TokenValidated(TokenValidatedContext context)
        {
            var user = await GetUserDetails(context);

            await EnsureUserIsReviewed(user);

            if (!user.IsFederated)
            {
                await EnsureUserRoles(user);
            }
        }

        private async Task EnsureUserRoles(UserDetail user)
        {
            user.UserRoles = user.UserRoles ?? new List<UserRoleAssignment>();

            var toAssign = await GetAutoUserRoleIds();

            foreach (var userRole in toAssign.Select(id => new UserRole { Id = id }))
            {
                if (user.UserRoles.All(ur => ur?.UserRole?.Id != userRole.Id))
                    user.UserRoles.Add(new UserRoleAssignment { UserRole = userRole });
            }

            await _cpClient.User.UpdateAsync(user.Id, user.AsUpdateRequest());
        }

        private async Task EnsureUserIsReviewed(UserDetail user)
        {
            if (user.AuthorizationState == AuthorizationState.ToBeReviewed)
                await _cpClient.User.ReviewAsync(user.Id, new UserReviewRequest {Reviewed = true});
        }

        private async Task<UserDetail> GetUserDetails(TokenValidatedContext context)
        {
            var email = context.Principal.Identity.Name;

            if (string.IsNullOrEmpty(email) || !email.Contains('@'))
            {
                throw new Exception($"Invalid or empty user email: '{email}'");
            }

            var results = await _cpClient.User.SearchAsync(new UserSearchRequest
            {
                Filter = FilterBase.FromExpression<User>(u => u.EmailAddress, email)
            });

            if (results.Results.Count != 1)
                throw new Exception("Unable to find the logged-in user in CP");

            var userId = results.Results.Single().Id;

            return await _cpClient.User.GetAsync(userId);
        }

        private async Task<IReadOnlyList<string>> GetAutoUserRoleIds()
        {
            var userRoles = _authorizationConfig.AutoAssignUserRoleIds;

            var checkRoleTasks = userRoles.Select(async r =>
            {
                var role = await _cpClient.UserRole.GetAsync(r);
                if (role == null)
                    throw new Exception($"Unable to find user role with id '{r}'");
            });

            await Task.WhenAll(checkRoleTasks);

            return userRoles;
        }
    }
}