import {
  Channel, FilterBase, AggregationFilter, OrFilter, AndFilter, Content, ContentService, ContentResolveBehavior
} from '@picturepark/sdk-v1-angular';

import {
  BasketService, groupBy, ContentDownloadDialogService, ContentModel
} from '@picturepark/sdk-v1-angular-ui';

import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit, ChangeDetectorRef, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ItemDetailsComponent } from '../item-details/item-details.component';
import { Subscription } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import { PageBase } from '../page-base';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-presskit',
  templateUrl: './presskit.component.html',
  styleUrls: ['./presskit.component.scss']
})
export class PresskitComponent extends PageBase implements OnDestroy {

  private subscription: Subscription = new Subscription();

  public constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    dialog: MatDialog) {

    super(media, changeDetectorRef, dialog);
  }

}
