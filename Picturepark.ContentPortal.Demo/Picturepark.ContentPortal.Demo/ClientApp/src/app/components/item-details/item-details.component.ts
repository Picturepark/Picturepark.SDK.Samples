import { Component, Input, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { LiquidRenderingService, ContentDetailsDialogComponent } from '@picturepark/sdk-v1-angular-ui';
import {
  ContentService,
  ContentDetail,
  ContentResolveBehavior,
  SchemaService,
  SchemaDetail,
} from '@picturepark/sdk-v1-angular';
import { Subscription } from 'rxjs';
import { RelationFieldInfo } from '@picturepark/sdk-v1-angular-ui/lib/features-module/layer-panels/models/relation-field-info';
import { MatDialog } from '@angular/material/dialog';
import { ContentDetailDialogOptions } from '@picturepark/sdk-v1-angular-ui/lib/features-module/content-details-dialog/ContentDetailDialogOptions';
import { PageBase } from '../page-base';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.scss'],
})
export class ItemDetailsComponent extends PageBase implements OnInit, OnDestroy {
  @Input()
  public itemId: string;

  public loading = true;

  public content: ContentDetail = null;

  public schemas: SchemaDetail[];

  private subscription: Subscription = new Subscription();

  constructor(
    private contentService: ContentService,
    private schemaService: SchemaService,
    private liquidRenderingService: LiquidRenderingService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    dialog: MatDialog
  ) {
    super(media, changeDetectorRef, dialog);
  }

  public ngOnInit() {
    const contentSubscription = this.contentService
      .get(this.itemId, [
        ContentResolveBehavior.Content,
        ContentResolveBehavior.Metadata,
        ContentResolveBehavior.Outputs,
        ContentResolveBehavior.OuterDisplayValueName,
        ContentResolveBehavior.OuterDisplayValueDetail,
        ContentResolveBehavior.InnerDisplayValueName,
        ContentResolveBehavior.InnerDisplayValueList,
        ContentResolveBehavior.InnerDisplayValueThumbnail,
      ])
      .subscribe(async (content) => {
        await this.liquidRenderingService.renderNestedDisplayValues(content);
        this.content = content;

        this.schemas = await this.schemaService
          .getMany(this.content.layerSchemaIds.concat(this.content.contentSchemaId))
          .toPromise();
        this.loading = false;
      });

    this.subscription.add(contentSubscription);
  }

  public relationClick(relation: RelationFieldInfo) {
    this.dialog.open(ContentDetailsDialogComponent, {
      data: <ContentDetailDialogOptions>{
        id: relation.contentId,
        showMetadata: true,
      },
      autoFocus: false,
      width: '980px',
      height: '700px',
      maxWidth: '98vw',
      maxHeight: '99vh',
    });
  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
