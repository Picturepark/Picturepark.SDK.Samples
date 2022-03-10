using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Picturepark.ContentPortal.Demo.Contract;
using ProxyKit;
using System.Net.Http.Headers;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Picturepark.ContentPortal.Demo.Controllers;
using Picturepark.SDK.V1;
using Picturepark.SDK.V1.Authentication;
using Picturepark.SDK.V1.Contract;
using System;

namespace Picturepark.ContentPortal.Demo
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
            PictureparkConfiguration = Configuration.GetSection("PictureparkConfiguration").Get<PictureparkConfiguration>();

            JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();
        }

        public IConfiguration Configuration { get; }
        public PictureparkConfiguration PictureparkConfiguration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            services.AddControllersWithViews();

            services.AddSingleton(PictureparkConfiguration);
            services.AddSingleton<IPictureparkService, PictureparkService>();
            services.AddSingleton<IPictureparkServiceSettings>(new PictureparkServiceSettings(
                new AccessTokenAuthClient(PictureparkConfiguration.ApiServer, PictureparkConfiguration.UserRegistrationAccessToken, PictureparkConfiguration.CustomerAlias)
            ));

            // Configure authentication
            services.AddAuthentication(options =>
                {
                    options.DefaultScheme = "Cookies";
                    options.DefaultChallengeScheme = "oidc";
                })
                .AddCookie("Cookies", options =>
                {
                    options.LoginPath = AccountController.LoginPath;
                    options.AccessDeniedPath = "/account/denied";
                })
                .AddOpenIdConnect("oidc", options =>
                {
                    options.SignInScheme = "Cookies";

                    options.Authority = PictureparkConfiguration.IdentityServer;
                    options.ClientId = PictureparkConfiguration.ClientId;
                    options.ClientSecret = PictureparkConfiguration.ClientSecret;
                    options.ResponseType = "code id_token";

                    // Development only setting
                    options.RequireHttpsMetadata = false;

                    options.SaveTokens = true;
                    options.GetClaimsFromUserInfoEndpoint = true;

                    options.EventsType = typeof(OidcEvents);

                    options.Scope.Clear();
                    foreach (var scope in PictureparkConfiguration.Scopes)
                    {
                        options.Scope.Add(scope);
                    }

                    if (!options.Scope.Contains("offline_access"))
                    {
                        options.Scope.Add("offline_access");
                    }

                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        NameClaimType = "preferred_username",
                        RoleClaimType = "role"
                    };
                });

            // add automatic token management
            services.AddAccessTokenManagement(options =>
            {
                options.User.RefreshBeforeExpiration = TimeSpan.FromMinutes(5);
            });

            services.AddResponseCompression();
            services.AddProxy();

            services.AddTransient<OidcEvents>();

            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
            }

            app.UseForwardedHeaders(new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.XForwardedProto
            });

            app.UseRouting();
            app.UseAuthentication();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });

            app.UseResponseCompression();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            // Proxy requests from "/api" to Picturepark API Server. If user is not logged in, use access token stored in config
            app.Map("/api", appProxy =>
            {
                appProxy.RunProxy(async context =>
                {
                    var forwardContext = context.ForwardTo(PictureparkConfiguration.ApiServer);
                    forwardContext.UpstreamRequest.Headers.Add("Picturepark-CustomerAlias", PictureparkConfiguration.CustomerAlias);

                    var accessToken = await context.GetUserAccessTokenAsync();
                    forwardContext.UpstreamRequest.Headers.Authorization = string.IsNullOrEmpty(accessToken) ?
                        new AuthenticationHeaderValue("Bearer", PictureparkConfiguration.AccessToken) :
                        new AuthenticationHeaderValue("Bearer", accessToken);

                    return await forwardContext.Send();
                });
            });

            app.UseSpa(spa =>
            {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501

                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseAngularCliServer(npmScript: "start");
                }
            });
        }
    }
}
