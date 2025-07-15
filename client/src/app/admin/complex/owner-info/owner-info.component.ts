import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { TextInputComponent } from '../../../_forms/text-input/text-input.component';
import { OwnerService } from '../../../_services/owner.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { InfoDialogComponent } from '../../../common/info-dialog/info-dialog.component';
import { OwnerListComponent } from '../owner-list/owner-list.component';
import { ConfirmDialogComponent } from '../../../common/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-owner-info',
  standalone: true,
  imports: [MatCardModule, ReactiveFormsModule, TextInputComponent,],
  templateUrl: './owner-info.component.html',
  styleUrl: './owner-info.component.css'
})
export class OwnerInfoComponent implements OnInit {

  private ownerService = inject(OwnerService)
  private fb = inject(FormBuilder);
  model: any = {};
  ownerInfoForm: FormGroup = new FormGroup({});
  validationErrors: string[] | undefined;

  constructor(public dialogOwnerListRef: MatDialogRef<OwnerListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.initializeForm();
    this.getOwnerByOwnerId();
  }

  initializeForm() {
    this.ownerInfoForm = this.fb.group({
      fullName: ['', Validators.required],
      idNumber: ['', Validators.required],
      email: ['', Validators.required],
      cellphone: ['', Validators.required],
    });
  }

  getOwnerByOwnerId() {
    if (this.data.ownerId == "0") {
      this.model = {}
      this.model.unitId = this.data.unitId;
      this.model.ownerId = this.data.ownerId;
    }
    else {
      this.ownerService.getOwnerByOwnerId(this.data.ownerId).subscribe(data => {
        this.model = data
        this.model.unitId = this.data.unitId;
        this.model.ownerId = this.data.ownerId;

      });
    }

  }

  createUpdateOwner() {
    this.ownerInfoForm.value.unitId = this.data.unitId;
    this.ownerInfoForm.value.ownerId = this.data.ownerId;
    this.ownerService.createUpdateOwner(this.ownerInfoForm.value).subscribe({
      next: _ => {
        const dialogInfo = this.dialog.open(InfoDialogComponent, {
          width: '250px',
          data: { message: 'Owner Information has been saved.' },
        });
        dialogInfo.afterClosed().subscribe(result => {
          console.log(result);
          if (result) {
            this.dialogOwnerListRef.close(result);
          }
        });

      },
      error: (error: { error: string; }) => {
        console.log(error.error);
        this.validationErrors = new Array(0);
        this.validationErrors.unshift(error.error);
      }
    });
  };

  cancel(result?: any) {
    //if the form is dirty and there is no result then show the message
    if ((this.ownerInfoForm.dirty) && (!result)) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '250px',
        data: { message: 'Are you sure you want to continue? Any unsaved changes will be lost' },
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // User confirmed deletion, implement your delete logic here
          this.dialogOwnerListRef.close(result);
        }
      });
    }

    else {
      this.dialogOwnerListRef.close(result);
    }
  };


}
