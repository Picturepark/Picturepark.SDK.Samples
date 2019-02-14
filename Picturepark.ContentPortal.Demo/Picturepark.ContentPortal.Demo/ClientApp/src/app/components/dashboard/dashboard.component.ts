import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { DashboardItem } from './../../models/dashboard-item.model';
import { ConfigService } from './../../services/config.service';
import { ThumbnailSize, ContentService } from '@picturepark/sdk-v1-angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnDestroy {
  public items: DashboardItem[] = [];
  public images: SafeUrl[] = [];
  private subscription: Subscription = new Subscription();

  constructor(
    private configService: ConfigService,
    private contentService: ContentService,
    private sanitizer: DomSanitizer,
    private router: Router) {
    this.items = [];

    this.items.forEach((item, index) => {
      const downloadSubscription = this.contentService.downloadThumbnail(item.imageId, ThumbnailSize.Large, null, null)
      .subscribe(result => {
        if (result !== null) {
          this.images[index] = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(result.data));
        }
      });

      this.subscription.add(downloadSubscription);
    });
  }

  public navigate(url: string) {
    this.router.navigateByUrl(url);
  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public trackByItem(index, item: DashboardItem) {
    return item.imageId;
  }
}
