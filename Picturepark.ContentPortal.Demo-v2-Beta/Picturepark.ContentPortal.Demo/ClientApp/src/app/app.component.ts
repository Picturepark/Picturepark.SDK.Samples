import { Component } from '@angular/core';
import { SessionService } from '@picturepark/sdk-v2-angular-ui';
import { RouterOutlet } from '@angular/router';
import { NgIf, AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-root',
    template: '<ng-container *ngIf="sessionService.initialized$ | async as initialized"><router-outlet *ngIf="initialized"></router-outlet></ng-container>',
    standalone: true,
    imports: [
        NgIf,
        RouterOutlet,
        AsyncPipe,
    ],
})
export class AppComponent {
  title = 'Microsite.ContentPortal';
  constructor(public sessionService: SessionService) {}
}
