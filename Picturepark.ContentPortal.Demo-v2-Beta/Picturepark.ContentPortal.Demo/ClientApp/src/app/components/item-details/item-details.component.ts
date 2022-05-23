import { Component, Input, OnInit, ChangeDetectorRef, Injector } from '@angular/core';
import { LiquidRenderingService, ContentDetailsDialogComponent } from '@picturepark/sdk-v2-angular-ui';
import {
  ContentService,
  ContentDetail,
  ContentResolveBehavior,
  SchemaService,
  SchemaDetail,
  SYSTEM_LAYER_SCHEMA_IDS,
} from '@picturepark/sdk-v2-angular';
import { RelationFieldInfo } from '@picturepark/sdk-v2-angular-ui/lib/features-module/layer-panels/models/relation-field-info';
import { MatDialog } from '@angular/material/dialog';
import { ContentDetailsDialogOptions } from '@picturepark/sdk-v2-angular-ui/lib/features-module/content-details-dialog/content-details-dialog-options';
import { PageBase } from '../page-base';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.scss'],
})
export class ItemDetailsComponent extends PageBase implements OnInit {
  @Input()
  public itemId: string;

  public loading = true;

  public content: ContentDetail = null;

  public schemas: SchemaDetail[];

  public systemLayerSchemaIds = SYSTEM_LAYER_SCHEMA_IDS;

  constructor(
    private contentService: ContentService,
    private schemaService: SchemaService,
    private liquidRenderingService: LiquidRenderingService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    dialog: MatDialog,
    injector: Injector
  ) {
    super(injector, media, changeDetectorRef, dialog);
  }

  public ngOnInit() {
    this.sub = this.contentService
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
  }

  public relationClick(relation: RelationFieldInfo) {
    this.dialog.open(ContentDetailsDialogComponent, {
      data: <ContentDetailsDialogOptions>{
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
}
