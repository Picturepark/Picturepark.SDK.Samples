import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ParamsUpdate } from '../../models/params-update.model';
import { ContentManagerComponent } from '../content-manager/content-manager.component';

@Component({
    selector: 'app-items',
    templateUrl: './items.component.html',
    styleUrls: ['./items.component.scss'],
    standalone: true,
    imports: [ContentManagerComponent],
})
export class ItemsComponent {
  public constructor(private router: Router, private route: ActivatedRoute) {}

  public onParamsUpdate(updatedParams: ParamsUpdate) {
    const commands = ['/items', updatedParams.channelId];
    if (updatedParams.itemId) {
      commands.push(updatedParams.itemId);
    }

    this.router.navigate(commands, {
      queryParams: updatedParams.queryParams,
    });
  }
}
