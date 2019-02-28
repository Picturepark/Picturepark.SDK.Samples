import { Component, OnInit, Input } from '@angular/core';
import {
  SchemaDetail, ContentDetail, FieldMultiTagbox, FieldSingleTagbox, FieldString, FieldTranslatedString, FieldBoolean
} from '@picturepark/sdk-v1-angular';

@Component({
  selector: 'app-layer-panels',
  templateUrl: './layer-panels.component.html',
  styleUrls: ['./layer-panels.component.scss']
})
export class LayerPanelsComponent implements OnInit {

  @Input()
  public schemas: SchemaDetail[];

  @Input()
  public content: ContentDetail;

  public layers: {
    layer: string;
    items: {
      field: string;
      value: string;
    }[]
  }[];

  constructor() { }

  ngOnInit() {
    this.layers = [];
    this.schemas.forEach(schema => {
      const schemaMetadata = this.content.metadata[this.toLowerCamel(schema.id)];

      const layer = {
        layer: schema.names['x-default'],
        items: []
      };
      schema.fields.forEach(field => {
        if (schemaMetadata[field.id]) {
          let value = '';

          switch (field.constructor) {
            case FieldMultiTagbox:
              value = schemaMetadata[field.id].map(i => i.displayValue.list).join(', ');
              break;
            case FieldSingleTagbox:
              value = schemaMetadata[field.id].displayValue.name;
              break;
            case FieldBoolean:
              value = schemaMetadata[field.id] ? 'Yes' : 'No';
              break;
            case FieldString:
              value = schemaMetadata[field.id];
              break;
            case FieldTranslatedString:
              value = schemaMetadata[field.id]['x-default'];
              break;
          }

          layer.items.push({
            field: field.names['x-default'],
            value: value
          });
        }
      });
      this.layers.push(layer);
    });
  }

  toLowerCamel(value: string): string {
    return value.charAt(0).toLowerCase() + value.slice(1);
  }
}
