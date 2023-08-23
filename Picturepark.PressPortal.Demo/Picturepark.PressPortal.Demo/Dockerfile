FROM mcr.microsoft.com/dotnet/core/aspnet:3.1 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build
WORKDIR /src
COPY ["Picturepark.PressPortal.Demo/Picturepark.PressPortal.Demo/Picturepark.PressPortal.Demo.csproj", "Picturepark.PressPortal.Demo/"]

ADD ./.git /.git
ADD ./version.json /version.json

RUN dotnet restore "Picturepark.PressPortal.Demo/Picturepark.PressPortal.Demo.csproj"
COPY Picturepark.PressPortal.Demo/ .
WORKDIR "/src/Picturepark.PressPortal.Demo"
RUN dotnet build "Picturepark.PressPortal.Demo.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Picturepark.PressPortal.Demo.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Picturepark.PressPortal.Demo.dll"]
