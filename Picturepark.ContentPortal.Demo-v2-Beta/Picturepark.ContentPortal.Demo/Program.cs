using System.IO;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Serilog;

namespace Picturepark.ContentPortal.Demo
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateWebHostBuilder(args).Build().Run();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .ConfigureAppConfiguration(
                    (hostBuilderContext, app) =>
                    {
                        app.SetBasePath(File.Exists("/etc/cp/appsettings.json")
                            ? "/etc/cp"
                            : Directory.GetCurrentDirectory());
                        app.AddJsonFile("appsettings.json", optional: false);
                        app.AddJsonFile($"appsettings.{hostBuilderContext.HostingEnvironment.EnvironmentName}.json",
                            optional: true);
                        app.AddEnvironmentVariables("CONTENTPORTAL_");
                        app.AddCommandLine(args);
                    })
                .ConfigureLogging(
                    (hostBuilderContext, logging) =>
                    {
                        logging.AddConfiguration(hostBuilderContext.Configuration);
                        logging.AddSerilog(Log.Logger);
                    })
                .UseStartup<Startup>();
    }
}
