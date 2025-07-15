// your-component.component.ts
import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MyDialogComponent } from '../my-dialog/my-dialog.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-your-component',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './my-component.component.html',
  
})
export class MyComponentComponent {
  dialogRef: MatDialogRef<MyDialogComponent> | undefined

  constructor(public dialog: MatDialog) { }

  openDialog(): void {
    if (!this.dialogRef) { // Prevent opening multiple dialogs
      this.dialogRef = this.dialog.open(MyDialogComponent, {
        // Optional dialog configuration
        width: '250px',
        position: { top: '50px', left: '50px' } // Example positioning
      });
    }
  }

  closeDialog(): void {
    console.log('close')
      if (this.dialogRef) {
        //this.dialogRef.close();
        this.dialogRef = undefined; // Reset the reference
      }
  }
}