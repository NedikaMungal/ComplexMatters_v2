import { Component, Inject, inject, Input, input, OnInit, output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { UnitService } from '../../../_services/unit.service';
import { TextInputComponent } from '../../../_forms/text-input/text-input.component';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ComplexListComponent } from '../complex-list/complex-list.component';
import { UnitListComponent } from '../unit-list/unit-list.component';
import { UnitType } from '../../../_models/unittype';
import { MatIconModule } from '@angular/material/icon';
import { ComplexInfoHoverComponent } from '../complex-info-hover/complex-info-hover.component';
import { InfoDialogComponent } from '../../../common/info-dialog/info-dialog.component';
import { ConfirmDialogComponent } from '../../../common/confirm-dialog/confirm-dialog.component';
//import { DialogData } from '../../../complexes/complex-detail/complex-detail.component';
//import { Complex } from '../../../_models/complex';

@Component({
  selector: 'app-unit-info',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, TextInputComponent, MatCardModule, MatIconModule],
  templateUrl: './unit-info.component.html',
  styleUrl: './unit-info.component.css'
})
export class UnitInfoComponent implements OnInit {
  private unitService = inject(UnitService)
  private fb = inject(FormBuilder);
  cancelRegister = output<any>();
  model: any = {};
  unitInfoForm: FormGroup = new FormGroup({});
  validationErrors: string[] | undefined;
  unitTypes: UnitType[] = [];
  complex: any = {};

  constructor(private dialog: MatDialog,
    public dialogRef: MatDialogRef<UnitListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.complex = this.data.complex;
    this.getUnitTypes();


  }

  ngOnInit(): void {
    this.initializeForm();
    this.getUnitByUnitId(this.data.unitId);
  }

  initializeForm() {
    this.unitInfoForm = this.fb.group({
      unitnumber: ['', Validators.required],
      unitTypeId: ['', Validators.required]
    });
  }
  getUnitTypes() {

    this.unitService.getUnitTypes().subscribe(data => {
      this.unitTypes = data
    });
  }



  getUnitByUnitId(unitId: string) {

    if (unitId == "0") {
      this.model = {}
      this.model.unitId = unitId;
    }
    else {
      this.unitService.getUnitByUnitId(unitId).subscribe(data => {
        this.model = data
        this.model.unitId = unitId;
      });
    }
  }

  createUpdateUnit() {

    this.unitInfoForm.value.complexId = this.data.complex.complexId;
    this.unitInfoForm.value.unitId = this.model.unitId;
    this.unitService.createUpdateUnit(this.unitInfoForm.value).subscribe({
      next: _ => {
        const dialogInfo = this.dialog.open(InfoDialogComponent, {
          width: '250px',
          data: { message: 'Complex Information has been saved' },
        });
        dialogInfo.afterClosed().subscribe(result => {
          if (result) {
            this.dialogRef.close(result);
          }
        }); this.cancel(this.unitInfoForm.value);
      },
      error: error => {
        console.log(error.error);
        this.validationErrors = new Array(0);
        this.validationErrors.unshift(error.error);
      }
    })
  }

  openDialogComplexInfoHover() {
    this.dialog.open(ComplexInfoHoverComponent, {
      width: '350px',
      height: '400px',
      data: {
        complex: this.data.complex
      },
    });
  }

  cancel(result?: any) {
    //if the form is dirty and there is no result then show the message
       if ((this.unitInfoForm.dirty) && (!result)) {
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
