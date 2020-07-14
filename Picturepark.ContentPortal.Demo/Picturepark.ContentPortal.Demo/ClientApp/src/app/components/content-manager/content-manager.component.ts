import { MediaMatcher } from '@angular/cdk/layout';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Injector,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  AggregationFilter,
  Channel,
  ChannelService,
  Content,
  ContentResolveBehavior,
  ContentSearchFacade,
  ContentSearchInputState,
  ContentService,
  FilterBase,
  getSearchState,
  updateUrlFromSearchState,
} from '@picturepark/sdk-v1-angular';
import { BasketService, ContentDownloadDialogService } from '@picturepark/sdk-v1-angular-ui';
import { distinctUntilChanged, map, switchMap, take, tap } from 'rxjs/operators';
import { ParamsUpdate } from '../../models/params-update.model';
import { ConfigService } from '../../services/config.service';
import { ItemDetailsComponent } from '../item-details/item-details.component';
import { PageBase } from '../page-base';

@Component({
  selector: 'app-content-manager',
  templateUrl: './content-manager.component.html',
  styleUrls: ['./content-manager.component.scss'],
})
export class ContentManagerComponent extends PageBase implements OnInit, OnChanges {
  @Input() baseFilter: FilterBase;
  @Input() showChannels = true;
  @Input() errorMessage: string;
  @Output() updateParams = new EventEmitter<ParamsUpdate>();

  @ViewChild(ItemDetailsComponent) public itemDetailsComponent: ItemDetailsComponent;
  @ViewChild('snav', { static: true }) public sideNav: MatSidenav;

  public channel: Channel = null;
  public searchQuery = '';
  public itemId = '';
  public basketItems: string[] = [];
  public isInBasket: boolean;

  private get queryParams(): Params {
    return Object.assign({}, this.route.snapshot.queryParams);
  }

  public constructor(
    private route: ActivatedRoute,
    public router: Router,
    private channelService: ChannelService,
    private basketService: BasketService,
    private configService: ConfigService,
    public facade: ContentSearchFacade,
    private contentService: ContentService,
    private contentDownloadDialogService: ContentDownloadDialogService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    dialog: MatDialog,
    injector: Injector
  ) {
    super(injector, media, changeDetectorRef, dialog);

    this.sub = this.basketService.basketChange.subscribe((items) => {
      this.basketItems = items;
      this.isInBasket = this.basketItems.some((item) => item === this.itemId);
    });
  }

  public ngOnInit() {
    // Redirect channel
    this.sub = this.route.paramMap
      .pipe(
        tap((i) => (this.itemId = i.get('itemId') || '')),
        map((i) => i.get('channelId')),
        distinctUntilChanged(),
        switchMap((i) =>
          this.showChannels && (i || this.configService.config.channelId)
            ? this.channelService.get(i || this.configService.config.channelId)
            : this.channelService.getAll().pipe(map((channels) => channels[0]))
        )
      )
      .subscribe((channel) => {
        if (this.channel?.id !== channel.id) {
          this.channel = channel;
        }
      });

    // subscribe on initial query string params and update search state
    this.sub = this.route.queryParamMap
      .pipe(
        map((queryParamMap) => {
          return {
            searchString: queryParamMap.get('searchString') || '',
            searchMode: queryParamMap.get('searchMode'),
            filter: queryParamMap.getAll('filter').map((fq) => AggregationFilter.fromJS(JSON.parse(fq))),
          };
        }),
        take(1)
      )
      .subscribe((searchInfo) => {
        const patchState: Partial<ContentSearchInputState> = getSearchState(searchInfo);

        if (patchState.searchString) {
          this.searchQuery = patchState.searchString;
        }

        this.facade.patchRequestState(patchState);
      });

    this.sub = this.facade.searchRequest$.subscribe((i) => updateUrlFromSearchState(i, this.queryParams, this.router));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['baseFilter']) {
      this.facade.patchRequestState({ baseFilter: this.baseFilter });
    }
  }

  public addToBasket() {
    if (this.isInBasket) {
      this.basketService.removeItem(this.itemId);
    } else {
      this.basketService.addItem(this.itemId);
    }
  }

  public previewItem(item: Content) {
    this.itemId = item.id;
    this.isInBasket = this.basketItems.some((i) => i === this.itemId);
    this.emitParamsUpdate(this.queryParams);
  }

  public closeItem() {
    this.itemId = '';
    this.emitParamsUpdate(this.queryParams);
  }

  public channelsChange(channels: Channel[]) {
    const channelIndex = channels.findIndex((c) => c.id === this.channel?.id);

    if (channelIndex > -1) {
      this.changeChannel(channels[channelIndex]);
    }
  }

  public changeChannel(channel: Channel) {
    // Clears aggregation Filters if there is a channelChange
    if (this.channel?.id !== channel.id) {
      this.facade.patchRequestState({ aggregationFilters: [], channelId: channel.id });
    }

    this.channel = channel;
    this.emitParamsUpdate(this.queryParams);
  }

  public changeSearchQuery(query: string) {
    this.facade.patchRequestState({ searchString: query });
    this.searchQuery = query;
  }

  public downloadItem() {
    this.contentService
      .get(this.itemId, [ContentResolveBehavior.Content])
      .pipe(take(1))
      .subscribe(async (content) => {
        this.contentDownloadDialogService.showDialog({
          mode: 'multi',
          contents: [content as any],
        });
      });
  }

  private emitParamsUpdate(queryParams: Params) {
    if (this.mobileQuery.matches && this.sideNav?.opened) {
      this.sideNav.toggle();
    }

    this.updateParams.emit({
      queryParams,
      channelId: this.channel?.id,
      itemId: this.itemId,
    });
  }
}
