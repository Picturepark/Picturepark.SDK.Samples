import { MediaMatcher } from '@angular/cdk/layout';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
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
  AggregatorBase,
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
import { of, partition } from 'rxjs';
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
export class ContentManagerComponent extends PageBase implements OnInit, OnChanges, OnDestroy {
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
  private searchRequestSub: any;

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
    const channel$ = this.route.paramMap.pipe(
      tap((i) => (this.itemId = i.get('itemId') || '')),
      map((i) => i.get('channelId')),
      distinctUntilChanged(),
      switchMap((i) =>
        this.showChannels && (i || this.configService.config.channelId)
          ? this.channelService.get(i || this.configService.config.channelId)
          : of(undefined)
      )
    );

    const [validChannel$, noChannel$] = partition(channel$, (i) => i && i.id !== '');

    this.sub = validChannel$.subscribe((channel) => {
      if (this.channel?.id !== channel?.id) {
        this.channel = channel;
      }
    });

    this.sub = noChannel$.pipe(switchMap(() => this.channelService.getAll())).subscribe((channels) => {
      if (channels && this.channel?.id !== channels[0]?.id) {
        this.channel = channels[0];
        this.emitParamsUpdate(this.queryParams);
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

        this.patchRequestState(patchState);
      });

    if (!this.searchRequestSub) {
      this.searchRequestSub = this.facade.searchRequest$.subscribe((i) => {
        const newSearchState = this.updateAggregationFilters(i);
        updateUrlFromSearchState(newSearchState, this.queryParams, this.router);
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['baseFilter']) {
      this.patchRequestState({ baseFilter: this.baseFilter });
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
    const params = this.queryParams;

    if (this.channel?.id !== channel?.id) {
      this.channel = channel;

      // Clears aggregation Filters, resets the aggregators
      this.patchRequestState({
        aggregationFilters: [],
        aggregators: channel.aggregations,
        channelId: channel.id,
      });

      delete params.filter;
      this.emitParamsUpdate(params);
    }
  }

  public changeSearchQuery(query: string) {
    if (this.searchQuery !== query) {
      this.patchRequestState({ searchString: query });
      this.searchQuery = query;
    }
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

  private patchRequestState(patchState: Partial<ContentSearchInputState>) {
    if (this.channel?.id && (!patchState.channelId || patchState.channelId !== this.channel?.id)) {
      patchState.channelId = this.channel.id;
    }

    this.facade.patchRequestState(patchState);
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.facade.resetRequestState();
    this.searchRequestSub.unsubscribe();
  }

  private filterDisabledAggregators(items: AggregatorBase[]) {
    return items.filter((item) => item.uiBehavior?.enableFilter);
  }

  private updateAggregationFilters(state: ContentSearchInputState) {
    if (!this.channel) {
      return state;
    }

    const enabledAggregators = this.filterDisabledAggregators(this.channel.aggregations);
    state.aggregationFilters = state.aggregationFilters.filter((af) =>
      enabledAggregators.some((da) => af.aggregationName === da.name)
    );

    return state;
  }
}
