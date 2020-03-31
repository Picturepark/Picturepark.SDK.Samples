import { Component } from '@angular/core';
import { Language } from '@picturepark/sdk-v1-angular';
import { LanguageService } from '@picturepark/sdk-v1-angular-ui';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
})
export class LanguageComponent {
  get languages(): Language[] {
    return this.languageService.languages;
  }
  get selectedLanguageCode(): string {
    return this.languageService.currentLanguage.ietf;
  }

  constructor(private languageService: LanguageService) {}

  public changeLanguage(languageCode: string) {
    this.languageService.changeCurrentLanguage(languageCode);
    window.location.reload();
  }
}
