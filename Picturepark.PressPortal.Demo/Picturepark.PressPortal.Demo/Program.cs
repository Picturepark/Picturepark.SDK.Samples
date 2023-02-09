﻿using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Serilog;
using System.IO;

namespace Picturepark.PressPortal.Demo
{
	public class Program
	{
		public static void Main(string[] args)
		{
		    CreateWebHostBuilder(args).Build().Run();
        }

	    public static IWebHostBuilder CreateWebHostBuilder(string[] args)
        {
            var basePath = File.Exists("/etc/cp/appsettings.json")
                ? "/etc/cp"
                : Directory.GetCurrentDirectory();

			var configuration = new ConfigurationBuilder()
				.SetBasePath(basePath)
				.AddJsonFile("appsettings.json")
				.AddJsonFile("hosting.json", optional: true)
				.Build();

			var logger = new LoggerConfiguration()
				.ReadFrom.Configuration(configuration)
				.Enrich.FromLogContext()
				.Enrich.WithMachineName()
				.Enrich.WithProcessName()
				.WriteTo.Console()
				.CreateLogger();

			var host = WebHost.CreateDefaultBuilder(args)
				.UseConfiguration(configuration)
				.UseSerilog(logger, dispose: true)
				.UseStartup<Startup>();

			return host;
		}
	}
}
