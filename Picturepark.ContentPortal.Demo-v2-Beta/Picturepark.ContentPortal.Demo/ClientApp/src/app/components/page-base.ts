import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, OnDestroy, Directive } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { BaseComponent } from '@picturepark/sdk-v2-angular-ui';
import { DemoInfoDialogComponent } from './demo-info-dialog/demo-info-dialog.component';

@Directive()
export abstract class PageBase extends BaseComponent implements OnDestroy {
  public mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  public constructor(media: MediaMatcher, changeDetectorRef: ChangeDetectorRef, public dialog: MatDialog) {
    super();
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  public openDialog(event): void {
    this.dialog.open(DemoInfoDialogComponent, {
      width: '450px',
      backdropClass: this.mobileQuery.matches ? undefined : 'none',
      position: this.mobileQuery.matches
        ? null
        : {
            top: event.y + 'px',
            left: event.x - 450 + 'px',
          },
    });
  }
}
