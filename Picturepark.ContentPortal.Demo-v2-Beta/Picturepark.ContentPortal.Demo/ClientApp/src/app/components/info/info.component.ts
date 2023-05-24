import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { ConfigService } from '../../services/config.service';
import { AppInfoDialogComponent } from './info-dialog.component';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
})
export class InfoComponent {
  @ViewChild('infoIcon', { read: ElementRef }) public infoIconRef: ElementRef;
  public infoTooltip: string;
  private readonly tooltip = (version: string) => `Version: ${version}`;

  constructor(private configService: ConfigService, private dialog: MatDialog) {
    this.infoTooltip = this.tooltip(this.configService.config.appVersion);
  }

  openDialog() {
    this.dialog.open(AppInfoDialogComponent, {
      data: {
        info: this.infoTooltip,
        element: this.infoIconRef,
      },
    });
  }
}
