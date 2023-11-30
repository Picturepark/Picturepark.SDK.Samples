import { CommonModule, UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Language, LanguageService } from '@picturepark/sdk-v2-angular';
import { TranslatePipe } from '@picturepark/sdk-v2-angular-ui';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatButtonModule, MatMenuModule, CommonModule, MatIconModule, TranslatePipe],
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
