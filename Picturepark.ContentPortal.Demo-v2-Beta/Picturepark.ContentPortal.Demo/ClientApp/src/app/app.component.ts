import { Component } from '@angular/core';
import { SessionService } from '@picturepark/sdk-v2-angular-ui';
import { RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  template:
    '@if (sessionService.initialized$ | async; as initialized) {@if (initialized) {<router-outlet></router-outlet>}}',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe],
})
export class AppComponent {
  title = 'Microsite.ContentPortal';
  constructor(public sessionService: SessionService) {}
}
