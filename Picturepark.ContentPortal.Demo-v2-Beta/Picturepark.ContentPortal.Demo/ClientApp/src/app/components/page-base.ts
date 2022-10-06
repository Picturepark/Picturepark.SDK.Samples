import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, OnDestroy, Injector, Directive } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LocalStorageService } from '@picturepark/sdk-v2-angular';
import { BaseComponent } from '@picturepark/sdk-v2-angular-ui';
import { LazyGetter } from 'lazy-get-decorator';
import { DemoInfoDialogComponent } from './demo-info-dialog/demo-info-dialog.component';

@Directive()
export abstract class PageBase extends BaseComponent implements OnDestroy {
  public mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  @LazyGetter()
  protected get localStorageService(): LocalStorageService {
    return this.injector.get(LocalStorageService);
  }

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
