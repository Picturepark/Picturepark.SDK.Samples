import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ParamsUpdate } from '../../models/params-update.model';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss'],
})
export class ItemsComponent {
  public constructor(private router: Router, private route: ActivatedRoute) {}

  public onParamsUpdate(updatedParams: ParamsUpdate) {
    this.router.navigate(['/items', updatedParams.channelId, updatedParams.itemId], {
      queryParams: updatedParams.queryParams,
    });
  }
}
