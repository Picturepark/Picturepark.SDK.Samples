The Content Portal is an SDK Example which enables customers to create a customized Web Portal to access the Picturepark Content Platform.
It must be hosted on customer side and in comparism to the Content Platform it can be highly customized wrt. to layout 
This example should give developers an easy entry point.


- Prerequisites
    - Visual Studio Code or another Editor
    - Node JS v10 or newer installed
    - .Net 6 installed
    - Customer instance provided by Picturepark available in advance and access must be granted
    - User must be flagged as developer (Please check with your Picturepark representative)
    - To enable to complete experience, some pre-configuration in your customer instance must be applied, such as Channels, Filters and Virtual Items. Please check this with you Picturepark representative or remove the Dashboard configuration (see below)

- Get Content Portal Project from GitHub (SDK Samples)
    - Select correct branch and download the package -> check your Content Platform version
    - After extracting the package, define the following settings in appsettings.json in the .Picturepark.ContentPortal.Demo folder to connect your Content Portal to your Content Platform

``` typescript 
{
        "ContactEmail": "", // email address used in contact link on landing page "If you would like to contribute your ideas, please contact us."
        "ApiServer": "", // use /service/info/customer endpoint to get "apiUrl". Example: https://[CUSTOMER].picturepark.com/service/info/customer
        "IdentityServer": "", // use /service/info/customer endpoint to get "identityServerUrl". Example: https://[CUSTOMER].picturepark.com/service/info/customer
        "ApplicationBaseUrl": "", // URL to your customer instance. Example: https://[CUSTOMER].picturepark.com
        "FrontendBaseUrl": "", // URL to your customer instance. Example: https://[CUSTOMER].picturepark.com
        "CustomerId": "", // use /service/info/customer endpoint to get "customerId". Example: https://[CUSTOMER].picturepark.com/service/info/customer
        "ClientId": "", // Create new API Client with scopes defined below. Client can be created within the customer instance. After login go to settings -> API Clients. NOTE: If you do not see "API Clients", your user has not been marked as developer. Contact your Picturepark representative.
        "ClientSecret": "", // The client secret that was defined during the creation of the API client
        "Scopes": [ "openid", "profile", "picturepark_api", "content_read", "profile_read", "schema_read", "output_read", "channel_read", "share_read", "share_write" ],
        "CustomerAlias": "", // use /service/info/customer endpoint to get "customerAlias". Example: https://[CUSTOMER].picturepark.com/service/info/customer
        "AccessToken": "", // Generate Access Token by using the client you just have created
        "AutoAssignUserRoleIds": [], // Only needed when using the Login functionality - String array of User Role Id`s which will be assigned on user registration
        "UserRegistrationAccessToken": "" // Only needed when using the Login functionality - Access token of a user who has "Manager Users" right to be able to register 
}
```

- Building and start the ContentPortal
    - Open .Picturepark.ContentPortal.Demo\Picturepark.ContentPortal.Demo in CMD
    - dotnet run environment=development
    - It should now be reachable at http://localhost:5000
- Publish the Content Portal
	- Please check here how to publish .NET Core apps with the .NET Core CLI (https://docs.microsoft.com/en-us/dotnet/core/deploying/deploy-with-cli)
	

Please find below some different possibilities of configuring the Content Portal. Using a Dashboard as landing page or directly show the content items with filter options and also whether the access is fully public so that users only consume the content, or with the possibility to login and then offer functionalites like e.g. Sharing. Please see below how to configure those functions

Solution without dashboard (https://demo-contentportal.picturepark.com/items/portal/)

  - remove dashboard configuration from /ClientApp/src/app/app-routing.module.ts
  - Routes must be configured like this:

``` typescript 
        const routes: Routes = [
        {
            path: '',
            redirectTo: 'items',
            pathMatch: 'full'
        },
        {
            path: 'items',
            component: ItemsComponent,
        },
        {
            path: 'items/:channelId',
            component: ItemsComponent,
        },
        {
            path: 'items/:channelId/:itemId',
            component: ItemsComponent,
            pathMatch: 'full'
        }
        ]; 
```

Solution with dashboard (https://demo-contentportal.picturepark.com/dashboard)

- keep configuration as is (dashboard configuration from /ClientApp/src/app/app-routing.module.ts)
		

By default the solution is using the Picturepark .net SDK (https://github.com/Picturepark/Picturepark.SDK.DotNet) to support user authentication and the use of more functionality, e.g. Share items. If the content portal is only used as a public portal where (public) users should have access to the Picturepark Content Platform, this functionality can be removed. 
Please remove the following code from the items component (ClientApp/src/app/components/items/items.component.html)

``` html
    <mat-divider [vertical]="true" class="divider" *ngIf="!mobileQuery.matches">
    </mat-divider>
    <app-profile></app-profile>
``` 

and in dashboard component (ClientApp/src/app/components/dashboard/dashboard.component.html)

``` html
  <div class="profile-wrap-mobile">
      <app-profile></app-profile>
  </div>

  <app-profile></app-profile>
``` 




