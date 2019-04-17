import { Component, Input, OnInit, OnDestroy, SecurityContext } from '@angular/core';
import {
  ContentService, ContentDetail, ContentResolveBehavior,
  ContentType, ContentDownloadLinkCreateRequest, ContentDownloadRequestItem, SchemaService, SchemaDetail
} from '@picturepark/sdk-v1-angular';
import { SafeUrl, DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Item } from '../../models/item.model';
import { Subscription } from 'rxjs';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.scss']
})
export class ItemDetailsComponent implements OnInit, OnDestroy {
  @Input()
  public itemId: string;

  public loading = true;

  public item: Item = null;

  public imageUrl: SafeUrl | null = null;

  public content: ContentDetail = null;

  public virtualItemHtml: SafeHtml | null = null;

  public outputFormats: {
    outputFormatId: string;
    name: string;
  }[];

  public schemas: SchemaDetail[];

  private subscription: Subscription = new Subscription();

  constructor(
    private contentService: ContentService,
    private schemaService: SchemaService,
    private translationService: TranslationService,
    private sanitizer: DomSanitizer) {
  }

  public openContent() {
    const isPdf = this.content.contentType === ContentType.InterchangeDocument || this.content.contentType === ContentType.Presentation;
    const isAudio = this.content.contentType === ContentType.Audio;
    const isVideo = this.content.contentType === ContentType.Video;

    const isMovie = isAudio || isVideo;
    const isImage = !isMovie && !isPdf;

    const previewOutput =
      isPdf ? this.content.outputs.filter(o => o.outputFormatId === 'Pdf')[0] :
        isAudio ? this.content.outputs.filter(o => o.outputFormatId === 'AudioSmall')[0] :
          isVideo ? this.content.outputs.filter(o => o.outputFormatId === 'VideoSmall')[0] :
            this.content.outputs.filter(o => o.outputFormatId === 'Preview')[0];

    const request = new ContentDownloadLinkCreateRequest({
      contents: [
        new ContentDownloadRequestItem({
          contentId: this.itemId,
          outputFormatId: previewOutput.outputFormatId
        })
      ]
    });

    const linkSubscription = this.contentService.createDownloadLink(request).subscribe(response => {
      const item = {
        id: this.itemId,
        isPdf: isPdf,
        isImage: isImage,
        isMovie: isMovie,
        isBinary: this.content.contentType !== ContentType.ContentItem,
        displayValues: {},
        previewUrl: isImage ? response.downloadUrl : this.imageUrl,
        originalUrl: response.downloadUrl,
        originalFileExtension: previewOutput.detail.fileExtension,
        detail: {
          width: (<any>previewOutput.detail).width,
          height: (<any>previewOutput.detail).height,
        }
      };

      ((<any>window).pictureparkWidgets).players.showDetailById(item.id, [item]);
    });

    this.subscription.add(linkSubscription);
  }

  public ngOnInit() {
    const contentSubscription = this.contentService.get(this.itemId,
      [ContentResolveBehavior.Metadata,
      ContentResolveBehavior.LinkedListItems,
      ContentResolveBehavior.Outputs,
      ContentResolveBehavior.InnerDisplayValueName,
      ContentResolveBehavior.InnerDisplayValueList,
      ContentResolveBehavior.InnerDisplayValueThumbnail]).subscribe(content => {
        this.content = content;
        this.item = this.processContent(content);

        if (this.content.contentType === ContentType.ContentItem) {
          this.virtualItemHtml = this.sanitizer.sanitize(SecurityContext.HTML, this.content.displayValues['detail']);
        } else {
          this.contentService.download(this.itemId, 'Preview', undefined, undefined, null).subscribe((fileResult) => {
            this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(fileResult.data));
          });
        }

        this.translationService.getOutputFormatTranslations().then(translations =>
          this.outputFormats = content.outputs && content.outputs.map(o => {
            return {
              outputFormatId: o.outputFormatId,
              name: translations[o.outputFormatId]
            };
          })
        );

        this.schemaService.getMany(this.content.layerSchemaIds.concat(this.content.contentSchemaId)).toPromise().then(t => {
          this.schemas = t;
        });
        this.loading = false;
      });

    this.subscription.add(contentSubscription);
  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private processContent(content: ContentDetail): Item {
    return {
      name: content.displayValues.name
    };
  }
}
