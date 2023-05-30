import { PictureparkConfiguration } from '@picturepark/sdk-v2-angular';
import { PictureparkUIConfiguration, TRANSLATIONS } from '@picturepark/sdk-v2-angular-ui';

import { ConfigService } from './services/config.service';
import { Translations } from './utilities/translations';

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
