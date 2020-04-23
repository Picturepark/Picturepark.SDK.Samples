import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import { ProfileService, UserProfile } from '@picturepark/sdk-v1-angular';
import { Observable } from 'rxjs';
import { ClientConfiguration } from '../../models/client-configuration.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  public config: ClientConfiguration;

  public profile$: Observable<UserProfile>;

  constructor(private configService: ConfigService, private profileService: ProfileService) {
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
