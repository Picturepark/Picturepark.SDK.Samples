import { Component } from '@angular/core';
import { SessionService } from '@picturepark/sdk-v2-angular-ui';

@Component({
  selector: 'app-root',
  template: '<ng-container *ngIf="sessionService.initialized$ | async as initialized"><router-outlet *ngIf="initialized"></router-outlet></ng-container>',
})
export class AppComponent {
  title = 'Microsite.ContentPortal';
  constructor(public sessionService: SessionService) {}
}
