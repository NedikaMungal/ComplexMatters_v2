import { Component, Inject, inject, Input, input, OnInit, output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { ComplexService } from '../../../_services/complex.service';
import { Router } from '@angular/router';
import { TextInputComponent } from '../../../_forms/text-input/text-input.component';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ComplexListComponent } from '../complex-list/complex-list.component';
import { ConfirmDialogComponent } from '../../../common/confirm-dialog/confirm-dialog.component';
import { InfoDialogComponent } from '../../../common/info-dialog/info-dialog.component';

@Component({
  selector: 'app-complex-info',
  standalone: true,
  imports: [ReactiveFormsModule, TextInputComponent, MatCardModule],
  templateUrl: './complex-info.component.html',
  styleUrl: './complex-info.component.css'
})
export class ComplexInfoComponent implements OnInit {
  private complexService = inject(ComplexService)
  private fb = inject(FormBuilder);
  model: any = {};
  complexInfoForm: FormGroup = new FormGroup({});
  validationErrors: string[] | undefined;

  constructor(private dialog: MatDialog,
    public dialogRef: MatDialogRef<ComplexListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }
  ngOnInit(): void {
    this.initializeForm();
    this.getComplex();
  }

  initializeForm() {
    this.complexInfoForm = this.fb.group({
      name: ['', Validators.required],
      addressline1: ['', Validators.required],
      addressline2: [''],
      suburb: [''],
      city: [''],
      province: [''],
      postalcode: [''],
    });
  }

  getComplex() {
    if (this.data.complexId == "0") {
      this.model = {}
      this.model.complexId = this.data.complexId;
    }
    else {
      this.complexService.getComplexByComplexId(this.data.complexId).subscribe(data => {
        this.model = data
        this.model.complexId = this.data.complexId;

      });
    }
  }

  createUpdateComplex() {

    this.complexInfoForm.value.complexId = this.data.complexId;
    console.log('createUpdateComplex: ', this.complexInfoForm.value.complexId);
    this.complexService.createUpdate(this.complexInfoForm.value).subscribe({
      next: _ => {

        const dialogInfo = this.dialog.open(InfoDialogComponent, {
          width: '250px',
          data: { message: 'Complex Information has been saved.' },
        });
        dialogInfo.afterClosed().subscribe(result => {
          console.log(result);
          if (result) {
            this.dialogRef.close(result);
          }
        });

      },
      error: error => {
        console.log(error.error);
        this.validationErrors = new Array(0);
        this.validationErrors.unshift(error.error);
      }
    });
  }

  cancel(result?: any) {
    //if the form is dirty and there is no result then show the message
    if ((this.complexInfoForm.dirty) && (!result)) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '250px',
        data: { message: 'Are you sure you want to continue? Any unsaved changes will be lost' },
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // User confirmed deletion, implement your delete logic here
          this.dialogRef.close(result);
        }
      });
    }

    else {
      this.dialogRef.close(result);
    }
  }
}

