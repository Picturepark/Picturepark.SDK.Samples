import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfigService } from '../../services/config.service';
import { AppInfoDialogComponent } from './info-dialog.component';
import { TranslatePipe } from '@picturepark/sdk-v2-angular-ui';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-info',
    templateUrl: './info.component.html',
    styleUrls: ['./info.component.scss'],
    standalone: true,
    imports: [MatIconModule, TranslatePipe],
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
