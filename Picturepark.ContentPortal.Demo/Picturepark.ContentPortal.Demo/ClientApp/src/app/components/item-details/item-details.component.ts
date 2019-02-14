import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import {
  ContentService, ContentDetail, ContentResolveBehavior,
  ContentType, ContentDownloadLinkCreateRequest, ContentDownloadRequestItem, DownloadLink
} from '@picturepark/sdk-v1-angular';
import * as lodash from 'lodash';
import { SafeUrl, DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Item } from '../../models/item.model';
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

  public item: Item = null;

  public imageUrl: SafeUrl | null = null;

  public content: ContentDetail = null;

  public virtualItemHtml: SafeHtml | null = null;

  public outputFormats: string[];

  private subscription: Subscription = new Subscription();

  constructor(private contentService: ContentService, private sanitizer: DomSanitizer) {
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

    const linkSubscription = this.contentService.createDownloadLink(request).subscribe((response: DownloadLink) => {
      const item = {
        id: this.itemId,
        isPdf: isPdf,
        isImage: isImage,
        isMovie: isMovie,
        isBinary: false,
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
      ContentResolveBehavior.Outputs]).subscribe(content => {
        this.content = content;
        this.item = this.processContent(content);

        if (this.content.contentType === ContentType.ContentItem) {
          this.virtualItemHtml = this.sanitizer.bypassSecurityTrustHtml(this.content.displayValues['detail']);
        } else {
          this.contentService.download(this.itemId, 'Preview', undefined, undefined, null).subscribe((fileResult) => {
            this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(fileResult.data));
          });
        }

        this.outputFormats = content.outputs && content.outputs.map(o => o.outputFormatId);

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
    const themes = lodash.get(content, 'metadata.generalInformation.theme') || [];
    const details = lodash.get(content, 'metadata.generalInformation.details') || [];
    const mediaTypes = lodash.get(content, 'metadata.generalInformation.mediaTypes') || [];
    const copyrights = lodash.get(content, 'metadata.generalInformation.copyright') || [];


    return {
      name: lodash.get(content, 'displayValues.name'),
      themes: themes.map(theme => {
        return lodash.get(theme, 'name.x-default');
      }),
      title: lodash.get(content, 'metadata.generalInformation.title.x-default'),
      details: details.map(theme => {
        return lodash.get(theme, 'name.x-default');
      }),
      mediaTypes: mediaTypes.map(theme => {
        return lodash.get(theme, 'name.x-default');
      }),
      copyrights: copyrights.map(theme => {
        return lodash.get(theme, 'name.x-default');
      }),
      source: lodash.get(content, 'metadata.generalInformation.source.x-default'),
      referenceId: lodash.get(content, 'metadata.migrationLayer.referenceId'),
      isPatched: lodash.get(content, 'metadata.migrationLayer.isPatched'),
    };
  }
}
