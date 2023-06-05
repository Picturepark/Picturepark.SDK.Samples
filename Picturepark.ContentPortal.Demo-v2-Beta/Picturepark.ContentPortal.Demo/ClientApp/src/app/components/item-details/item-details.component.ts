import { ChangeDetectionStrategy, Component, Input, OnInit, inject, signal } from '@angular/core';
import {
  ContentDetailsDialogComponent,
  ContentImagePreviewComponent,
  LayerPanelsComponent,
} from '@picturepark/sdk-v2-angular-ui';
import {
  ContentService,
  ContentDetail,
  ContentResolveBehavior,
  SchemaService,
  SchemaDetail,
  SYSTEM_LAYER_SCHEMA_IDS,
} from '@picturepark/sdk-v2-angular';
import { RelationFieldInfo } from '@picturepark/sdk-v2-angular-ui/lib/features-module/layer-panels/models/relation-field-info';
import { ContentDetailsDialogOptions } from '@picturepark/sdk-v2-angular-ui/lib/features-module/content-details-dialog/content-details-dialog-options';
import { PageBase } from '../page-base';
import { map, mergeMap } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, MatProgressBarModule, MatCardModule, ContentImagePreviewComponent, LayerPanelsComponent],
})
export class ItemDetailsComponent extends PageBase implements OnInit {
  @Input() itemId: string;

  private contentService = inject(ContentService);
  private schemaService = inject(SchemaService);

  systemLayerSchemaIds = SYSTEM_LAYER_SCHEMA_IDS;
  state = signal({
    loading: true,
    content: null as ContentDetail | null,
    schemas: null as SchemaDetail[] | null,
  });

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
      .pipe(
        mergeMap((content) =>
          this.schemaService
            .getMany(content.layerSchemaIds.concat(content.contentSchemaId))
            .pipe(map((schemas) => ({ content, schemas })))
        )
      )
      .subscribe(({ content, schemas }) => {
        this.state.set({
          loading: false,
          content,
          schemas,
        });
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
