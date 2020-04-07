import { Component, ViewEncapsulation } from '@angular/core';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class InfoComponent {
  public readonly infoTooltip: string;
  private readonly tooltip = (version: string) => `Version: ${version}`;

  constructor(private configService: ConfigService) {
    this.infoTooltip = this.tooltip(this.configService.config.appVersion);
  }
}
