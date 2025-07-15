import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';


    @Component({
      selector: 'app-confirm-dialog',
      standalone: true,
      imports: [MatButtonModule, MatDialogModule],
      templateUrl: './confirm-dialog.component.html'
    })
    export class ConfirmDialogComponent {
      constructor(
        public dialogRef: MatDialogRef<ConfirmDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { message: string }
      ) {}

      onNoClick(): void {
        this.dialogRef.close(false);
      }

      onYesClick(): void {
        this.dialogRef.close(true);
      }
    }