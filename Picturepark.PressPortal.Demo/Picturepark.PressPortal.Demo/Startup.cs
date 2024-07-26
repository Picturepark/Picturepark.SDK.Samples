using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Picturepark.PressPortal.Demo.Configuration;
using Picturepark.PressPortal.Demo.Helpers;
using Picturepark.PressPortal.Demo.Repository;
using Picturepark.PressPortal.Demo.Services;
using System.Globalization;

namespace Picturepark.PressPortal.Demo
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
       }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddConfiguration<PictureparkConfiguration>(Configuration);

            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            // Register PictureparkAccessTokenService as singleton
            services.AddSingleton<IPictureparkAccessTokenServiceSettings, PictureparkAccessTokenServiceSettings>();
            services.AddSingleton<IPictureparkAccessTokenService, PictureparkAccessTokenService>();

            // Register PictureparkPerRequestService as transient
            services.AddTransient<IPictureparkPerRequestServiceSettings, PictureparkPerRequestServiceSettings>();
            services.AddTransient<IPictureparkPerRequestService, PictureparkPerRequestService>();

            services.AddSingleton<IServiceHelper, ServiceHelper>();
            services.AddSingleton<IPressReleaseRepository, PressReleaseRepository>();

            // Add the localization services to the services container
            services.AddLocalization(options => options.ResourcesPath = "Resources");

            services.AddControllersWithViews()
                .AddViewLocalization(LanguageViewLocationExpanderFormat.Suffix)
                .AddDataAnnotationsLocalization();

            // Configure supported cultures and localization options
            services.Configure<RequestLocalizationOptions>(options =>
            {
                var supportedCultures = new[]
                {
                        new CultureInfo("en"),
                        new CultureInfo("de")
                };
                options.DefaultRequestCulture = new RequestCulture(culture: "en", uiCulture: "en");
                options.SupportedCultures = supportedCultures;
                options.SupportedUICultures = supportedCultures;
            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            var locOptions = app.ApplicationServices.GetService<IOptions<RequestLocalizationOptions>>();
            app.UseRequestLocalization(locOptions.Value);

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

            app.UseStaticFiles();

            app.UseRouting();
            app.UseAuthentication();

            // Register / update schemas in PCP
            var serviceHelper = app.ApplicationServices.GetService<IServiceHelper>();
            var updateSchema = env.IsDevelopment();

            //serviceHelper.EnsureSchemaExists<PressRelease>(null, updateSchema).Wait();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Overview}/{id?}");
            });
        }
    }
}
