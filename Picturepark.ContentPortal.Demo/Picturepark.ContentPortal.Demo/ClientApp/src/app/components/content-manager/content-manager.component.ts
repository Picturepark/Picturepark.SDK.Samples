import {
  Channel, FilterBase, Content, ContentService, ContentResolveBehavior, ChannelService, ContentSearchFacade
} from '@picturepark/sdk-v1-angular';

import {
  BasketService, ContentDownloadDialogService, ContentModel
} from '@picturepark/sdk-v1-angular-ui';

import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit, ChangeDetectorRef, OnDestroy, ViewChild, Input, Output, EventEmitter, SimpleChanges, OnChanges, Query } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ItemDetailsComponent } from '../item-details/item-details.component';
import { Subscription } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import { PageBase } from '../page-base';
import { take } from 'rxjs/operators';
import { ParamsUpdate } from '../../models/params-update.model';
import { ConfigService } from '../../services/config.service';



@Component({
  selector: 'app-content-manager',
  templateUrl: './content-manager.component.html',
  styleUrls: ['./content-manager.component.scss']
})
export class ContentManagerComponent extends PageBase implements OnInit, OnDestroy, OnChanges {

  @Input() baseFilter: FilterBase;
  @Input() showChannels = true;
  @Input() errorMessage: string;
  @Output() updateParams = new EventEmitter<ParamsUpdate>();

  @ViewChild(ItemDetailsComponent) public itemDetailsComponent: ItemDetailsComponent;
  public channelId: string;
  public channel: Channel = null;
  public searchQuery: string = null;
  public itemId: string;
  public basketItems: string[] = [];
  public isInBasket = true;
  @ViewChild('snav', { static: true }) public sideNav: MatSidenav;

  private subscription: Subscription = new Subscription();

  public constructor(
    private route: ActivatedRoute,
    private channelService: ChannelService,
    private basketService: BasketService,
    private configService: ConfigService,
    public facade: ContentSearchFacade,
    private contentService: ContentService,
    private contentDownloadDialogService: ContentDownloadDialogService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    dialog: MatDialog) {

    super(media, changeDetectorRef, dialog);

    const basketChangeSubscription = this.basketService.basketChange.subscribe(items => {
      this.basketItems = items;
      this.isInBasket = this.basketItems.some(item => item === this.itemId);
    });

    this.subscription.add(basketChangeSubscription);
  }

  public ngOnInit() {
    if (this.showChannels) {
      this.channelId = this.route.snapshot.params['channelId'] || '';
    } else {
      this.channelService.get(this.configService.config.channelId).subscribe( channel => {
        this.channel = channel;
        this.channelId = this.channel.id;
      });
    }

    this.itemId = this.route.snapshot.params['itemId'] || '';

    // subscribe on search changes from header component, not needed for search-suggest-box
    const searchQuery$ = this.facade.searchRequest$.subscribe( request => {
      this.searchQuery = request.searchString;
    });

    this.subscription.add(searchQuery$);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['baseFilter']) {
      this.facade.patchRequestState({ baseFilter: this.baseFilter})
    }
    
  }
  
  public ngOnDestroy(): void {
    super.ngOnDestroy();

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

  public previewItem(item: ContentModel<Content>) {
    this.itemId = item.item.id;
    this.isInBasket = item.isInBasket;
    this.emitParamsUpdate(this.QueryParams);
  }

  public closeItem() {
    this.itemId = '';
    this.emitParamsUpdate(this.QueryParams);
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


  public changeChannel(channel: Channel) {
    this.channelId = channel.id;
    this.channel = channel;
    this.emitParamsUpdate(this.QueryParams);
  }

  public changeSearchQuery(query: string) {
    this.facade.patchRequestState({searchString: query})
    this.searchQuery = query;
  }

  public downloadItem() {
    this.contentService.get(this.itemId, [ContentResolveBehavior.Content])
    .pipe(take(1))
    .subscribe(async content => {
        this.contentDownloadDialogService.showDialog({
          mode: 'multi',
          contents: [content as any]
        });
      });
  }

  private emitParamsUpdate(queryParams: Params) {
    if (this.mobileQuery.matches) {
      if (this.sideNav.opened) {
        this.sideNav.toggle();
      }
    }

    this.updateParams.emit({
      queryParams,
      channelId: this.channelId,
      itemId: this.itemId
    });

  }
}
