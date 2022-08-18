FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
EXPOSE 5000
EXPOSE 5001

WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
ARG PICTUREPARK_SCOPE_NPM_AUTH_TOKEN

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - \
    && apt-get install -y \
        nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /src
ADD ./.git /.git
ADD ./version.json /version.json
ADD ./NuGet.config /NuGet.config

COPY ["Picturepark.ContentPortal.Demo-v2-Beta/Picturepark.ContentPortal.Demo/Picturepark.ContentPortal.Demo.csproj", "Picturepark.ContentPortal.Demo/"]
RUN dotnet restore "Picturepark.ContentPortal.Demo/Picturepark.ContentPortal.Demo.csproj"
COPY Picturepark.ContentPortal.Demo-v2-Beta/ .
WORKDIR "/src/Picturepark.ContentPortal.Demo/ClientApp"
RUN node create-npmrc.js "$PICTUREPARK_SCOPE_NPM_AUTH_TOKEN"
RUN npm install -g yarn
RUN yarn install
WORKDIR "/src/Picturepark.ContentPortal.Demo"
RUN dotnet build "Picturepark.ContentPortal.Demo.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Picturepark.ContentPortal.Demo.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Picturepark.ContentPortal.Demo.dll"]
