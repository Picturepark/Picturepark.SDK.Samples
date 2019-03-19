import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { DashboardItem } from './../../models/dashboard-item.model';
import {
  ThumbnailSize,
  ContentService,
  ContentSearchRequest,
  TermFilter,
  LifeCycleFilter,
  ContentSearchType,
  ContentResolveBehavior,
  BrokenDependenciesFilter,
  SortInfo,
  SortDirection
} from '@picturepark/sdk-v1-angular';
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
    private contentService: ContentService,
    private sanitizer: DomSanitizer,
    private router: Router) {
    this.items = [];
    this.load();
  }

  public async load(): Promise<void> {
    const contents = await this.contentService.search(new ContentSearchRequest({
      start: 0,
      limit: 20,
      lifeCycleFilter: LifeCycleFilter.ActiveOnly,
      brokenDependenciesFilter: BrokenDependenciesFilter.All,
      searchType: ContentSearchType.Metadata,
      channelId: 'rootChannel',
      debugMode: false,
      filter: new TermFilter ({
        field: 'contentSchemaId',
        term: 'FeaturedContent'
      }),
      sort: [
        new SortInfo({ field: 'featuredContent.headline', direction: SortDirection.Asc })
      ]
    })).toPromise();

    const details = await this.contentService.getMany(
      contents.results.map(i => i.id),
      [ContentResolveBehavior.Content]
    ).toPromise();

    details.forEach(i => {
      this.items.push({
        imageId: i.content['teaserImage']._targetId,
        title: i.content['headline']['x-default'],
        description: i.content['abstract']['x-default'],
        path: i.content['resourceLink']
      });
    });

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
