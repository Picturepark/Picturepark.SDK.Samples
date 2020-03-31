import { Component } from '@angular/core';
import { LanguageService, IOptionModel } from '@picturepark/sdk-v1-angular-ui';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
})
export class LanguageComponent {
  get languages(): IOptionModel[] {
    return this.languageService.languageOptions;
  }
  get selectedLanguageCode(): string {
    return this.languageService.currentLanguageCode;
  }

  constructor(private languageService: LanguageService) {}

  public changeLanguage(languageCode: string) {
    this.languageService.changeCurrentLanguage(languageCode);
    window.location.reload();
  }
}
