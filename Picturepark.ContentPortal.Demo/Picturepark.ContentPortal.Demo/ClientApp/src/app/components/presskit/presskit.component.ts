
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ParamsUpdate } from '../../models/params-update.model';
import { FilterBase, TermFilter } from '@picturepark/sdk-v1-angular';

@Component({
  selector: 'app-presskit',
  templateUrl: './presskit.component.html',
  styleUrls: ['./presskit.component.scss']
})
export class PresskitComponent implements OnInit {

  public baseFilter: FilterBase ;
  public errorMessage: string;

  public constructor( private router: Router, private route: ActivatedRoute ) {
  }

  ngOnInit() {
    // Test url
    // https://localhost:44332/presskit?baseFilter={%22field%22:%22layerSchemaIds%22,%22term%22:%22LayerWaft%22,%22kind%22:%22TermFilter%22}
    try {
      const baseFilterJson = this.route.snapshot.queryParamMap.get('baseFilter');
      if (baseFilterJson) {
        const parsedBaseFilter = FilterBase.fromJS(JSON.parse(baseFilterJson));
        if (parsedBaseFilter instanceof FilterBase) {
          this.baseFilter = parsedBaseFilter;
          return;
        }
      }
      this.handleBaseFilterError();
    } catch (error) {
      this.handleBaseFilterError();
    }
  }

  public onUpdateParams(updatedParams: ParamsUpdate) {
    this.router.navigate(
      ['/presskit', updatedParams.itemId],
      { queryParams: updatedParams.queryParams }
    );
  }

  private handleBaseFilterError() {
      // TODO pass paramenter to content manager with error message
      this.errorMessage = 'Something went wrong, your gallery collection cannot be found...';
  }

}
