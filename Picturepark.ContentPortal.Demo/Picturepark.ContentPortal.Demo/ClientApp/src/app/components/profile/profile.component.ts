import { Component } from '@angular/core';
import { ProxyAuthService } from '../../services/proxy-auth.service';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  public identityUrl: string;
  public apiUrl: string;
  public email: string;

  constructor(public authService: ProxyAuthService, private configService: ConfigService) {
    this.identityUrl = this.configService.oidcConfig.identityServer;
    this.apiUrl = this.configService.oidcConfig.apiServer;
    this.email = this.configService.oidcConfig.contactEmail;
  }

  public login() {
    this.authService.startAuthentication();
  }

  public logout() {
    this.authService.startSignout();
  }
}
