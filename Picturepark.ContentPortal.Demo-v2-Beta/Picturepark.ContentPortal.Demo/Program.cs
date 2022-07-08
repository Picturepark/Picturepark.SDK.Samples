using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
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
                .ConfigureLogging(
                    (hostBuilderContext, logging) =>
                    {
                        logging.AddConfiguration(hostBuilderContext.Configuration);
                        logging.AddSerilog(Log.Logger);
                    })
                .UseStartup<Startup>();
    }
}
