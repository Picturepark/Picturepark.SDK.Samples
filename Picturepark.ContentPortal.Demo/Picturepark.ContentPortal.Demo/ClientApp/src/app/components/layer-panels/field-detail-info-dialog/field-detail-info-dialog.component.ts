import { Component, OnInit, SecurityContext } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-field-detail-info-dialog',
  templateUrl: './field-detail-info-dialog.component.html',
  styleUrls: ['./field-detail-info-dialog.component.scss']
})
export class FieldDetailInfoDialogComponent implements OnInit {

  public title: string;
  public message: string;
  public displayMessage: string;

  constructor(
    public dialogRef: MatDialogRef<FieldDetailInfoDialogComponent>,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.displayMessage = this.sanitizer.sanitize(SecurityContext.HTML, this.message);
  }

}
