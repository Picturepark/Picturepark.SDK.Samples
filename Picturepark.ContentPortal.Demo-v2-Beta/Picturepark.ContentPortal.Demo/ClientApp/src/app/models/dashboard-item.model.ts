import { SafeUrl } from '@angular/platform-browser';
import { TranslatedStringDictionary } from '@picturepark/sdk-v2-angular';

export interface DashboardItem {
  path: string;
  imageId: string;
  imageUrl: SafeUrl;
  title: TranslatedStringDictionary;
  description: TranslatedStringDictionary;
}
