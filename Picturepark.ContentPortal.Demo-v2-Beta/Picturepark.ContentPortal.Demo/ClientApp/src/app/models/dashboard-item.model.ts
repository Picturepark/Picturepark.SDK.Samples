import { TranslatedStringDictionary } from '@picturepark/sdk-v1-angular';

export interface DashboardItem {
  path: string;
  imageId: string;
  title: TranslatedStringDictionary;
  description: TranslatedStringDictionary;
}
