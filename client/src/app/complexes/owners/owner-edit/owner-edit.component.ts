import { AfterViewInit, Component, inject, Input, input, OnInit, output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { OwnerService } from '../../../_services/owner.service';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { TextInputComponent } from '../../../_forms/text-input/text-input.component';

@Component({
  selector: 'app-owner-edit',
  standalone: true,
  imports: [MatCardModule,  TextInputComponent, ReactiveFormsModule],
  templateUrl: './owner-edit.component.html',
  styleUrl: './owner-edit.component.css'
})
export class OwnerEditComponent implements OnInit {
  private ownerService = inject(OwnerService)
  model: any = {};
  @Input() selectedOwnerId: number = 0;
  ownerEditForm: FormGroup = new FormGroup({});
  private fb = inject(FormBuilder);
  
  ngOnInit(): void 
  {
    this.initializeForm();
  }

    initializeForm() {
      this.ownerEditForm = this.fb.group({
  fullname: ['', Validators.required],
  email: ['', Validators.required],
        cellphone: ['', Validators.required],
      });
    }

  getOwnerByOwnerId(ownerId: number)
  {
    console.log(ownerId);
   if (ownerId== 0) {
      this.model = {}
      this.model.ownerId = ownerId;
    }
    else {
      this.ownerService.getOwnerByOwnerId(ownerId).subscribe(data => {
        this.model = data
         this.model.ownerId = ownerId;

      });
    }
  }



}
