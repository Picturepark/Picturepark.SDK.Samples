#addin Cake.Services&version=0.3.6

// Arguments
var target = Argument("target", "PublishContentPortal");
var configuration = Argument("configuration", "Release");
var directory = GetVar("sourceDirectory", "../Publish");
var serviceName = GetVar("serviceName", "").Replace("[space]", " ");
var targetServer = GetVar("server", "");
var targetServerDir = GetVar("serverDirectory", "");

public string GetVar(string variable, string fallback)
{
    return Argument(variable, EnvironmentVariable(variable) ?? fallback);
}

Task("PublishContentPortal")
  .Description("Create build artifacts")
  .Does(() =>
{
    var publishDir = directory + "/Picturepark.ContentPortal.Demo";

    Information("Publish to: " + publishDir);

    CleanDirectory(publishDir);

    DotNetCorePublish(
        "../Picturepark.ContentPortal.Demo/Picturepark.ContentPortal.Demo/Picturepark.ContentPortal.Demo.csproj", 
            new DotNetCorePublishSettings {
            Configuration = configuration,
            OutputDirectory = publishDir
        });
});

Task("PublishPressPortal")
  .Description("Create build artifacts")
  .Does(() =>
{
    var publishDir = directory + "/Picturepark.PressPortal.Demo";

    Information("Publish to: " + publishDir);

    CleanDirectory(publishDir);

    DotNetCorePublish(
        "../Picturepark.PressPortal.Demo/Picturepark.PressPortal.Demo/Picturepark.PressPortal.Demo.csproj", 
            new DotNetCorePublishSettings {
            Configuration = configuration,
            OutputDirectory = publishDir
        });
});

Task("DeployContentPortal")
    .Description("Deploy to server")
    .Does(() =>
{
    var publishDir = directory + "/Picturepark.ContentPortal.Demo";

    StopService(serviceName, targetServer);

    Information("Clean directory ClientApp");
    CleanDirectory(targetServerDir + "ClientApp");

    Information("Copy artifacts to server");
    CopyDirectory(publishDir, targetServerDir);

    StartService(serviceName, targetServer);
});

Task("DeployPressPortal")
    .Description("Deploy to server")
    .Does(() =>
{
    var publishDir = directory + "/Picturepark.PressPortal.Demo";

    StopService(serviceName, targetServer);

    Information("Copy artifacts to server");
    CopyDirectory(publishDir, targetServerDir);

    StartService(serviceName, targetServer);
});

RunTarget(target);
