import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, OnDestroy, Injector } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BaseComponent } from '@picturepark/sdk-v1-angular-ui';
import { DemoInfoDialogComponent } from './demo-info-dialog/demo-info-dialog.component';

export abstract class PageBase extends BaseComponent implements OnDestroy {
  public mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  public constructor(
    injector: Injector,
    media: MediaMatcher,
    changeDetectorRef: ChangeDetectorRef,
    public dialog: MatDialog
  ) {
    super(injector);
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  public ngOnDestroy(): void {
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
