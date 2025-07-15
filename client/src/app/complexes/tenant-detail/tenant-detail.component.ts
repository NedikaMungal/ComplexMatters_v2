import { Component, inject, input, OnInit, output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AccountService } from '../../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { TextInputComponent } from "../../_forms/text-input/text-input.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-tenant-detail',
  standalone: true,
  imports: [ReactiveFormsModule, TextInputComponent],
  templateUrl: './tenant-detail.component.html',
  styleUrl: './tenant-detail.component.css'
})
export class TenantDetailComponent implements OnInit{
  private accountService = inject(AccountService);
  private toastr = inject(ToastrService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  cancelRegister = output<boolean>();
  model: any = {};
  tenantDetailForm: FormGroup = new FormGroup({});
  maxDate = new Date();
  validationErrors: string[] | undefined;
  complexList = 
  [ {value: 'complex1', display: 'Complex 1'}, 
    {value: 'complex2', display: 'Complex 2'},
    {value: 'complex3', display: 'Complex 3'},
  ]

    unitList = 
  [ {value: 'unit1', display: 'Unit 1'}, 
    {value: 'unit2', display: 'Unit 2'}, 
    {value: 'unit3', display: 'Unit 3'}, 
    {value: 'unit4', display: 'Unit 4'},
    {value: 'unit5', display: 'Unit 5'}, 
    {value: 'unit6', display: 'Unit 6'}, 
  ]



  ngOnInit(): void {
    
    this.initializeForm();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  initializeForm() {
    this.tenantDetailForm = this.fb.group({

      fullname: ['', Validators.required],
      idnumber: ['', Validators.required],
      email: ['', Validators.required],
      cellphone: ['', Validators.required],
      });
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value ? null : {isMatching: true}
    }
  }
  register() {
    const dob = this.getDateOnly(this.tenantDetailForm.get('dateOfBirth')?.value);
    this.tenantDetailForm.patchValue({dateOfBirth: dob});
    
    this.accountService.register(this.tenantDetailForm.value).subscribe({
      next: _ => this.router.navigateByUrl('/members') ,
      error: error => this.validationErrors = error
    })
  }

  cancel(){
    this.cancelRegister.emit(false);
  }

  private getDateOnly(dob: string | undefined) {
    if (!dob) return;
    return new Date(dob).toISOString().slice(0, 10);
  } 

}
