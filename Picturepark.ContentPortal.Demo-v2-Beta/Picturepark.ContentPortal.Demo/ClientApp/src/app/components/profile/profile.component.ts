import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import { ProfileService, UserProfile } from '@picturepark/sdk-v2-angular';
import { Observable } from 'rxjs';
import { ClientConfiguration } from '../../models/client-configuration.model';
import { TranslatePipe } from '@picturepark/sdk-v2-angular-ui';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  standalone: true,
  imports: [MatButtonModule, MatMenuModule, TranslatePipe],
})
export class ProfileComponent implements OnInit {
  public config: ClientConfiguration;

  public profile$: Observable<UserProfile>;

  constructor(
    private configService: ConfigService,
    private profileService: ProfileService
  ) {
    this.config = this.configService.config;
  }

  ngOnInit(): void {
    this.profile$ = this.profileService.get();
  }

  public login() {
    window.location.replace('/account/login');
  }

  public logout() {
    window.location.replace('/account/logout');
  }
}
