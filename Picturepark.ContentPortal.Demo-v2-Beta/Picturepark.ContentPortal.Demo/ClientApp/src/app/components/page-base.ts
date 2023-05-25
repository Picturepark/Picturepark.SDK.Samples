import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, OnDestroy, Directive, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BaseComponent } from '@picturepark/sdk-v2-angular-ui';
import { DemoInfoDialogComponent } from './demo-info-dialog/demo-info-dialog.component';

@Directive()
export abstract class PageBase extends BaseComponent implements OnDestroy {
  public mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  private media = inject(MediaMatcher);
  protected changeDetectorRef = inject(ChangeDetectorRef);
  public dialog = inject(MatDialog);

  public constructor() {
    super();

    this.mobileQuery = this.media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => this.changeDetectorRef.detectChanges();
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
