import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { take } from 'rxjs/operators';
import { InfoService } from '../../services/info.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class InfoComponent implements OnInit {
  public infoTooltip: string;
  private readonly tooltip = (appName: string, version: string) => `${appName} \n
  Version: ${version}`;

  constructor(private infoService: InfoService) {}

  ngOnInit(): void {
    this.infoService
      .getAppInfo()
      .pipe(take(1))
      .subscribe((appInfo) => (this.infoTooltip = this.tooltip(appInfo.name, appInfo.version)));
  }
}
