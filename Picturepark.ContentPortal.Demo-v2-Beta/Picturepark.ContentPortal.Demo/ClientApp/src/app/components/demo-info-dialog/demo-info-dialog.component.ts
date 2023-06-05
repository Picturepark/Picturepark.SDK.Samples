import { Component } from '@angular/core';
import { TranslatePipe } from '@picturepark/sdk-v2-angular-ui';

@Component({
  selector: 'app-demo-info-dialog',
  templateUrl: './demo-info-dialog.component.html',
  styleUrls: ['./demo-info-dialog.component.scss'],
  standalone: true,
  imports: [TranslatePipe],
})
export class DemoInfoDialogComponent {}
