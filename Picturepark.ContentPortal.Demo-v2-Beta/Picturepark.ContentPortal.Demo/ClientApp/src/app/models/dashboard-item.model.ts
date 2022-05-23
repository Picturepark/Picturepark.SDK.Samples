import { TranslatedStringDictionary } from '@picturepark/sdk-v2-angular';

export interface DashboardItem {
  path: string;
  imageId: string;
  title: TranslatedStringDictionary;
  description: TranslatedStringDictionary;
}
