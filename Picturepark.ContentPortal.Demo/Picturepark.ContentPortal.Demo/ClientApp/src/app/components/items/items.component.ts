import {
  Channel, FilterBase, AggregationFilter,
  ContentDownloadLinkCreateRequest, ContentService, OrFilter, AndFilter
} from '@picturepark/sdk-v1-angular';

import {
  BasketService
} from '@picturepark/sdk-v1-angular-ui';

import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit, ChangeDetectorRef, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as lodash from 'lodash';
import { ItemDetailsComponent } from '../item-details/item-details.component';
import { Subscription } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit, OnDestroy {
  @ViewChild(ItemDetailsComponent) public itemDetailsComponent: ItemDetailsComponent;
  public mobileQuery: MediaQueryList;
  public channel: Channel = null;
  public searchQuery: string = null;
  public filter: FilterBase = null;
  public aggregationFilters: AggregationFilter[] = [];
  public itemId: string;
  private channelId: string;
  public basketItems: string[] = [];
  public isInBasket = true;
  @ViewChild('snav') public sideNav: MatSidenav;

  private _mobileQueryListener: () => void;
  private subscription: Subscription = new Subscription();

  public constructor(
    private route: ActivatedRoute,
    private router: Router,
    private basketService: BasketService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher) {

    const basketChangeSubscription = this.basketService.basketChange.subscribe(items => {
      this.basketItems = items;
      this.isInBasket = this.basketItems.some(item => item === this.itemId);
    });

    this.subscription.add(basketChangeSubscription);

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  public ngOnInit() {
    this.channelId = this.route.snapshot.params['channelId'] || '';
    this.itemId = this.route.snapshot.params['itemId'] || '';
    this.searchQuery = this.route.snapshot.queryParams['search'];
    const filterQuery = this.route.snapshot.queryParams['filter'];

    if (filterQuery) {
      if (typeof filterQuery === 'string') {
        this.aggregationFilters = [AggregationFilter.fromJS(JSON.parse(filterQuery))];
      } else {
        this.aggregationFilters = (filterQuery as string[]).map(fq => AggregationFilter.fromJS(JSON.parse(fq)));
      }
      this.filter = this.createFilter(this.aggregationFilters);
    }
  }

  public ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);

    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public addToBasket() {
    if (this.isInBasket) {
      this.basketService.removeItem(this.itemId);
    } else {
      this.basketService.addItem(this.itemId);
    }
  }

  public previewItem(itemId: string) {
    this.itemId = itemId;
    this.isInBasket = this.basketItems.some(item => item === this.itemId);
    this.updateRoute(this.QueryParams);
  }

  public closeItem() {
    this.itemId = '';
    this.updateRoute(this.QueryParams);
  }


  public get QueryParams(): Params {
    return Object.assign({}, this.route.snapshot.queryParams);
  }

  public channelsChange(channels: Channel[]) {
    const channelIndex = channels.findIndex(c => c.id === this.channelId);

    if (channelIndex > -1) {
      this.changeChannel(channels[channelIndex]);
    } else {
      // TODO: not found
    }
  }

  public changeAggregationFilters(aggregationFilters: AggregationFilter[]) {
    const filtersQuery = aggregationFilters.map(filter => JSON.stringify(filter.toJSON()));

    const queryParams = this.QueryParams;

    if (filtersQuery.length > 0) {
      queryParams['filter'] = filtersQuery;
    } else {
      delete queryParams['filter'];
    }

    this.updateRoute(queryParams);
  }

  public changeChannel(channel: Channel) {
    this.channelId = channel.id;
    this.channel = channel;
    this.updateRoute(this.QueryParams);
  }

  public changeSearchQuery(query: string) {
    this.searchQuery = query;

    const queryParams = this.QueryParams;

    if (this.searchQuery) {
      queryParams['search'] = this.searchQuery;
    } else {
      delete queryParams['search'];
    }

    this.updateRoute(queryParams);
  }

  private updateRoute(queryParams: Params) {
    if (this.mobileQuery.matches) {
      if (this.sideNav.opened) {
        this.sideNav.toggle();
      }
    }

    this.router.navigate(['/items', this.channelId, this.itemId], { queryParams });
  }

  private createFilter(aggregationFilters: AggregationFilter[]): FilterBase {
    const flatten = lodash.chain(aggregationFilters).groupBy('aggregationName').toPairs().value();
    const preparedFilters = flatten
      .map(array => {
        const filtered = array[1].filter(aggregationFilter => aggregationFilter.filter)
          .map(aggregationFilter => aggregationFilter.filter as FilterBase);

        switch (filtered.length) {
          case 0: return null;
          case 1: return filtered[0];
          default: return new OrFilter({ filters: filtered });
        }
      })
      .filter(value => value !== null);

    switch (preparedFilters.length) {
      case 0: return null;
      case 1: return preparedFilters[0];
      default: return new AndFilter({ filters: preparedFilters as FilterBase[] });
    }
  }
}
