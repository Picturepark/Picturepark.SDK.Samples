import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, OnDestroy } from '@angular/core';
import { DemoInfoDialogComponent } from './demo-info-dialog/demo-info-dialog.component';
import { MatDialog } from '@angular/material';

export abstract class PageBase implements OnDestroy {

    public mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;

    public constructor(media: MediaMatcher, changeDetectorRef: ChangeDetectorRef, public dialog: MatDialog) {
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
          position: this.mobileQuery.matches ? null : {
            top: event.y + 'px',
            left: (event.x - 450) + 'px'
          }
        });
      }
}
