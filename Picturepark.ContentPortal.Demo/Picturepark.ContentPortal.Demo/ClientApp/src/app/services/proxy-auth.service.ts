import { Router } from '@angular/router';
import { AuthService } from '@picturepark/sdk-v1-angular';
import { ConfigService } from './config.service';
import { UserManager, User, UserManagerSettings } from 'oidc-client';
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
    const config = this.configService.oidcConfig;
    const oidcSettings: UserManagerSettings = {
      client_id: config.clientId,
      scope: config.scope,
      authority: config.identityServer,
      response_type: 'id_token token',
      filterProtocolClaims: true,
      loadUserInfo: true,
      redirect_uri: config.redirectUrl,
      post_logout_redirect_uri: window.location.origin,
      automaticSilentRenew: true,
      acr_values: 'tenant:{"id":"' +
        config.customerId + '","alias":"' +
        config.customerAlias + '"}'
    };

    return new UserManager(oidcSettings);
  }
}

