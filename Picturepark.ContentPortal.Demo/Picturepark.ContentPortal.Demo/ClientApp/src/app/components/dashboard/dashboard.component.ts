import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { Component, ChangeDetectorRef, Injector } from '@angular/core';
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
  SortDirection,
  TranslatedStringDictionary,
} from '@picturepark/sdk-v1-angular';
import { Subscription } from 'rxjs';
import { PageBase } from '../page-base';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent extends PageBase {
  public items: DashboardItem[] = [];
  public images: SafeUrl[] = [];
  public searchQuery: string = null;

  constructor(
    private contentService: ContentService,
    private sanitizer: DomSanitizer,
    private router: Router,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    dialog: MatDialog,
    injector: Injector
  ) {
    super(injector, media, changeDetectorRef, dialog);
    this.load();
  }

  public async load(): Promise<void> {
    const contents = await this.contentService
      .search(
        new ContentSearchRequest({
          limit: 20,
          lifeCycleFilter: LifeCycleFilter.ActiveOnly,
          brokenDependenciesFilter: BrokenDependenciesFilter.All,
          searchType: ContentSearchType.Metadata,
          debugMode: false,
          filter: new TermFilter({
            field: 'contentSchemaId',
            term: 'FeaturedContent',
          }),
          sort: [new SortInfo({ field: 'featuredContent.headline', direction: SortDirection.Asc })],
        })
      )
      .toPromise();

    const details = await this.contentService
      .getMany(
        contents.results.map((i) => i.id),
        [ContentResolveBehavior.Content]
      )
      .toPromise();

    details.forEach((i) => {
      this.items.push({
        imageId: i.content['teaserImage']?._targetId,
        title: TranslatedStringDictionary.fromJS(i.content['headline']),
        description: TranslatedStringDictionary.fromJS(i.content['abstract']),
        path: i.content['resourceLink'],
      });
    });

    this.items.forEach((item, index) => {
      if (!item.imageId) {
        return;
      }
      this.sub = this.contentService
        .downloadThumbnail(item.imageId, ThumbnailSize.Large, null, null)
        .subscribe((result) => {
          if (result !== null) {
            this.images[index] = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(result.data));
          }
        });
    });
  }

  public changeSearchQuery(query: string) {
    if (!query) {
      return;
    }

    this.searchQuery = query;
    this.router.navigate(['/items'], { queryParams: { searchString: query } });
  }

  public navigate(url: string) {
    this.router.navigateByUrl(url);
  }

  public trackByItem(index, item: DashboardItem) {
    return item.imageId;
  }
}
