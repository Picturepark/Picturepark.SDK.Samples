import { AuthService, AccessTokenAuthService,  PICTUREPARK_API_URL } from '@picturepark/sdk-v1-angular';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CommonModule } from '@angular/common';
import { PictureparkUiModule } from '@picturepark/sdk-v1-angular-ui';

import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AppComponent } from './app.component';
import { ItemsComponent } from './components/items/items.component';
import { ItemDetailsComponent } from './components/item-details/item-details.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ConfigService, configFactory } from './services/config.service';
import { LayerPanelsComponent } from './components/layer-panels/layer-panels.component';
import { DemoInfoDialogComponent } from './components/demo-info-dialog/demo-info-dialog.component';
import { MaterialModule } from './material.module';

@NgModule({
  declarations: [
    AppComponent,
    ItemsComponent,
    ItemDetailsComponent,
    ProfileComponent,
    DashboardComponent,
    LayerPanelsComponent,
    DemoInfoDialogComponent
  ],
  entryComponents: [DemoInfoDialogComponent],
  imports: [
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    PictureparkUiModule,
    CommonModule,
    MaterialModule
  ],
  providers: [
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: configFactory,
      deps: [ConfigService],
      multi: true
    },
    { provide: PICTUREPARK_API_URL, useValue: '/api'},
    { provide: AuthService, useClass: AccessTokenAuthService },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
