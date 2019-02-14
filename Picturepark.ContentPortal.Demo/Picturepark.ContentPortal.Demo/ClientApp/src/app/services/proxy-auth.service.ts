import { Router } from '@angular/router';
import { AuthService } from '@picturepark/sdk-v1-angular';
import { ConfigService } from './config.service';
import { UserManager, User } from 'oidc-client';
import { Injectable } from '@angular/core';

@Injectable()
export class ProxyAuthService extends AuthService {
  private manager: UserManager;
  private user: User;

  constructor(private configService: ConfigService,
    private router: Router) {

    super('/api');

    this.manager = this.createOidcManager();
    this.manager.getUser().then(user => {
      this.user = user;
    });
  }

  public startAuthentication(): Promise<void> {
    localStorage.setItem('redirectUrl', this.router.url);

    return this.manager.signinRedirect();
  }

  public startSignout(): Promise<void> {
    return this.manager.signoutRedirect();
  }

  public completeSignout(): Promise<void> {
    return this.manager.signoutRedirectCallback();
  }

  public completeAuthentication(): Promise<void> {
    return this.manager.signinRedirectCallback().then(user => {
      this.user = user;

      const redirectUrl = localStorage.getItem('redirectUrl');

      if (redirectUrl) {
        this.router.navigateByUrl(redirectUrl);
      } else {
        this.router.navigateByUrl('/');
      }

    });
  }

  public get isAuthenticated(): boolean {
    return this.user != null && !this.user.expired;
  }

  public transformHttpRequestOptions(options: any): Promise<any> {
    return new Promise((resolve) => {
      if (options.headers) {
        if (this.isAuthenticated) {
          options.headers = options.headers.append('Authorization', 'Bearer ' + this.user.access_token);
        }
      }

      resolve(options);
    });
  }

  private createOidcManager(): UserManager {
    const oidcSettings = {
      client_id: this.configService.oidcConfig.clientId,
      scope: this.configService.oidcConfig.scope,
      authority: this.configService.oidcConfig.identityServer,
      response_type: 'id_token token',
      filterProtocolClaims: true,
      loadUserInfo: true,
      redirect_uri: this.configService.oidcConfig.redirectUrl,
      post_logout_redirect_uri: window.location.origin,
      acr_values: 'tenant:{"id":"' +
        this.configService.oidcConfig.customerId + '","alias":"' +
        this.configService.oidcConfig.customerAlias + '"}'
    };

    return new UserManager(oidcSettings);
  }
}

