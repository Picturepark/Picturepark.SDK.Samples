using System.Net.Http.Headers;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Picturepark.ContentPortal.Demo.Contract;
using ProxyKit;

namespace Picturepark.ContentPortal.Demo
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);

            services.AddResponseCompression();
            services.AddProxy();

            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseResponseCompression();
            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            // Proxy requests from "/api" to Picturepark API Server. If user is not logged in, use access token stored in config
            var clientConfiguration = Configuration.GetSection("ClientConfiguration").Get<ClientConfiguration>();
            var serverConfiguration = Configuration.GetSection("ServerConfiguration").Get<ServerConfiguration>();

            app.RunProxy("/api", context =>
            {
                var forwardContext = context.ForwardTo(clientConfiguration.ApiServer);
                forwardContext.UpstreamRequest.Headers.Add("Picturepark-CustomerAlias", clientConfiguration.CustomerAlias);
                if (forwardContext.UpstreamRequest.Headers.Authorization == null)
                {
                    forwardContext.UpstreamRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", serverConfiguration.AccessToken);
                }
                return forwardContext.Execute();
            });

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller}/{action=Index}/{id?}");
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
