import { enableProdMode, APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { pictureparkUIConfigurationFactory, pictureparkConfigurationFactory } from './app/app.module';
import { environment } from './environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { withInterceptorsFromDi, provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { PICTUREPARK_CONFIGURATION, AuthService, NoopAuthService, LocaleModule } from '@picturepark/sdk-v2-angular';
import { PICTUREPARK_UI_CONFIGURATION, PictureparkUiModule } from '@picturepark/sdk-v2-angular-ui';
import { ConfigService, configFactory } from './app/services/config.service';
import { provideRouter } from '@angular/router';
import { APP_ROUTES } from './app/app-routing';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(PictureparkUiModule, MatDialogModule, CommonModule, LocaleModule.forRoot('system')),
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: configFactory,
      deps: [ConfigService],
      multi: true,
    },
    { provide: PICTUREPARK_UI_CONFIGURATION, useFactory: pictureparkUIConfigurationFactory, deps: [ConfigService] },
    { provide: PICTUREPARK_CONFIGURATION, useFactory: pictureparkConfigurationFactory },
    { provide: AuthService, useClass: NoopAuthService },
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(APP_ROUTES),
  ],
}).catch((err) => console.log(err));
