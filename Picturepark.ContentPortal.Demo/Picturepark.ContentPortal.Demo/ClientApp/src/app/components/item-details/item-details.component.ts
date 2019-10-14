import { Component, Input, OnInit, OnDestroy, SecurityContext } from '@angular/core';
import { LiquidRenderingService } from '@picturepark/sdk-v1-angular-ui';
import {
  ContentService, ContentDetail, ContentResolveBehavior, ContentType, SchemaService, SchemaDetail
} from '@picturepark/sdk-v1-angular';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.scss']
})
export class ItemDetailsComponent implements OnInit, OnDestroy {
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
    private sanitizer: DomSanitizer) {
  }

  public ngOnInit() {
    const contentSubscription = this.contentService.get(
      this.itemId,
      [
        ContentResolveBehavior.Content,
        ContentResolveBehavior.Metadata,
        // ContentResolveBehavior.LinkedListItems,
        ContentResolveBehavior.Outputs,
        ContentResolveBehavior.OuterDisplayValueName,
        ContentResolveBehavior.OuterDisplayValueDetail,
        ContentResolveBehavior.InnerDisplayValueName,
        ContentResolveBehavior.InnerDisplayValueList,
        ContentResolveBehavior.InnerDisplayValueThumbnail
      ]).subscribe(async content => {
        await this.liquidRenderingService.renderNestedDisplayValues(content);
        this.content = content;

        this.schemas = await this.schemaService.getMany(this.content.layerSchemaIds.concat(this.content.contentSchemaId)).toPromise();
        this.loading = false;
      });

    this.subscription.add(contentSubscription);
  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
