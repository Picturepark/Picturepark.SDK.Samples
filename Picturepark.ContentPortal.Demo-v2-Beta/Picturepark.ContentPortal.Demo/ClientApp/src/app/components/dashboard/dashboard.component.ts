import { DomSanitizer } from '@angular/platform-browser';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
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
} from '@picturepark/sdk-v2-angular';
import { PageBase } from '../page-base';
import { forkJoin, map, mergeMap, of } from 'rxjs';
import { SearchBoxComponent, TranslatePipe } from '@picturepark/sdk-v2-angular-ui';
import { MatCardModule } from '@angular/material/card';
import { InfoComponent } from '../info/info.component';
import { ProfileComponent } from '../profile/profile.component';
import { LanguageComponent } from '../language/language.component';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    MatToolbarModule,
    RouterLink,
    MatButtonModule,
    LanguageComponent,
    ProfileComponent,
    InfoComponent,
    NgFor,
    MatCardModule,
    TranslatePipe,
    SearchBoxComponent,
  ],
})
export class DashboardComponent extends PageBase {
  items = toSignal(this.load());

  constructor(private contentService: ContentService, private sanitizer: DomSanitizer, private router: Router) {
    super();
  }

  public load() {
    return this.contentService
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
      .pipe(
        mergeMap((contents) => {
          return this.contentService
            .getMany(
              contents.results.map((i) => i.id),
              [ContentResolveBehavior.Content]
            )
            .pipe(
              map((details) =>
                details.map(
                  (i) =>
                    ({
                      imageId: i.content['teaserImage']?._targetId,
                      title: TranslatedStringDictionary.fromJS(i.content['headline']),
                      description: TranslatedStringDictionary.fromJS(i.content['abstract']),
                      path: i.content['resourceLink'],
                    } as DashboardItem)
                )
              )
            );
        }),
        mergeMap((details) => {
          const requests = details.map((item) =>
            item.imageId
              ? this.contentService.downloadThumbnail(item.imageId, ThumbnailSize.Large, null, null).pipe(
                  map((result) => ({
                    ...item,
                    imageUrl: this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(result.data)),
                  }))
                )
              : of(item)
          );

          return forkJoin(requests);
        })
      );
  }

  public changeSearchQuery(query: string) {
    if (!query) {
      return;
    }

    this.router.navigate(['/items', 'portal'], { queryParams: { searchString: query } });
  }

  public navigate(url: string) {
    this.router.navigateByUrl(url);
  }

  public trackByItem(index, item: DashboardItem) {
    return item.imageId;
  }
}
