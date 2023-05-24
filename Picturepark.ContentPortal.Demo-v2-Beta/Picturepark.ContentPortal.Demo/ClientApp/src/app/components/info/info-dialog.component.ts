import { Component, ElementRef, Inject, OnInit } from '@angular/core';
import { MatLegacyDialogConfig as MatDialogConfig, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

export interface DialogData {
  info: string;
  element: ElementRef;
}

@Component({
  selector: 'app-info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrls: ['./info-dialog.component.scss'],
})
export class AppInfoDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<AppInfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit() {
    const matDialogConfig = new MatDialogConfig();
    const rect: DOMRect = this.data.element.nativeElement.getBoundingClientRect();

    matDialogConfig.position = { right: '16px', top: `${rect.bottom + 10}px` };
    this.dialogRef.updatePosition(matDialogConfig.position);
  }
}
