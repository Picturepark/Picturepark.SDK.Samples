import { HttpClientModule } from '@angular/common/http';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';

import {
  AuthService,
  NoopAuthService,
  LocaleModule,
  PictureparkConfiguration,
  PICTUREPARK_CONFIGURATION,
} from '@picturepark/sdk-v2-angular';
import {
  PictureparkUiModule,
  PICTUREPARK_UI_CONFIGURATION,
  PictureparkUIConfiguration,
  TRANSLATIONS,
} from '@picturepark/sdk-v2-angular-ui';

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
import { InfoComponent } from './components/info/info.component';
import { PresskitComponent } from './components/presskit/presskit.component';
import { ContentManagerComponent } from './components/content-manager/content-manager.component';
import { AppInfoDialogComponent } from './components/info/info-dialog.component';
import { PICTUREPARK_CDN_URL } from '@picturepark/sdk-v2-angular';

const uiTranslations = TRANSLATIONS;
Object.assign(uiTranslations, Translations);

export function pictureparkUIConfigurationFactory(configService: ConfigService) {
  return <PictureparkUIConfiguration>{
    ContentBrowserComponent: {
      download: true,
      select: true,
      share: configService.config.isAuthenticated,
      preview: true,
      basket: true,
    },
    BasketComponent: {
      download: true,
      select: false,
      share: configService.config.isAuthenticated,
    },
    BrowserToolbarComponent: {
      select: true,
    },
    ListBrowserComponent: {
      download: true,
      select: true,
      share: true,
    },
  };
}

export function pictureparkConfigurationFactory() {
  return <PictureparkConfiguration>{
    apiServer: '/api',
  };
}

@NgModule({
  declarations: [
    AppComponent,
    ItemsComponent,
    PresskitComponent,
    ItemDetailsComponent,
    ProfileComponent,
    DashboardComponent,
    DemoInfoDialogComponent,
    ContentManagerComponent,
    LanguageComponent,
    AppInfoDialogComponent,
    InfoComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    PictureparkUiModule,
    CommonModule,
    MaterialModule,
    LocaleModule.forRoot('system'),
  ],
  providers: [
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: configFactory,
      deps: [ConfigService],
      multi: true,
    },
    { provide: PICTUREPARK_UI_CONFIGURATION, useFactory: pictureparkUIConfigurationFactory, deps: [ConfigService] },
    { provide: PICTUREPARK_CONFIGURATION, useFactory: pictureparkConfigurationFactory },
    { provide: PICTUREPARK_CDN_URL, useValue: undefined },
    { provide: AuthService, useClass: NoopAuthService },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
