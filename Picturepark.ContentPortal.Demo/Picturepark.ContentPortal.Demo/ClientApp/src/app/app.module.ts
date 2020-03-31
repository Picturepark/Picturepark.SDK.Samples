import { HttpClientModule } from '@angular/common/http';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';

import {
  AuthService,
  AccessTokenAuthService,
  PICTUREPARK_API_URL,
  LocaleModule,
} from '@picturepark/sdk-v1-angular';
import {
  PictureparkUiModule,
  PICTUREPARK_UI_CONFIGURATION,
  PictureparkUIConfiguration,
  TRANSLATIONS,
  LanguageService,
} from '@picturepark/sdk-v1-angular-ui';

import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AppComponent } from './app.component';
import { ItemsComponent } from './components/items/items.component';
import { ItemDetailsComponent } from './components/item-details/item-details.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ConfigService, configFactory } from './services/config.service';
import { DemoInfoDialogComponent } from './components/demo-info-dialog/demo-info-dialog.component';
import { MaterialModule } from './material.module';
import { LanguageComponent } from './components/language/language.component';
import { Translations } from './utilities/translations';

const uiTranslations = TRANSLATIONS;
Object.assign(uiTranslations, Translations);

export function PictureparkUIConfigurationFactory(configService: ConfigService) {
  return<PictureparkUIConfiguration> {
      'ContentBrowserComponent': {
          download: true,
          select: true,
          share: configService.config.isAuthenticated,
          preview: true,
          basket: true
      },
      'BasketComponent': {
          download: true,
          select: false,
          share: configService.config.isAuthenticated
      },
      'BrowserToolbarComponent': {
          select: true,
      },
      'ListBrowserComponent': {
          download: true,
          select: true,
          share: true
      }
  };
}

export function languageFactory(languageService: LanguageService) {
  return () => languageService.loadLanguages();
}

@NgModule({
  declarations: [
    AppComponent,
    ItemsComponent,
    ItemDetailsComponent,
    ProfileComponent,
    DashboardComponent,
    DemoInfoDialogComponent,
    LanguageComponent,
  ],
  entryComponents: [DemoInfoDialogComponent],
  imports: [
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    PictureparkUiModule,
    CommonModule,
    MaterialModule,
    LocaleModule.forRoot(),
  ],
  providers: [
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: configFactory,
      deps: [ConfigService],
      multi: true,
    },
    { provide: PICTUREPARK_UI_CONFIGURATION, useFactory: PictureparkUIConfigurationFactory, deps: [ConfigService] },
    { provide: PICTUREPARK_API_URL, useValue: '/api' },
    { provide: AuthService, useClass: AccessTokenAuthService },
    LanguageService,
    {
      provide: APP_INITIALIZER,
      useFactory: languageFactory,
      deps: [LanguageService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
