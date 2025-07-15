import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-complex-info-hover',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './complex-info-hover.component.html',
  styleUrl: './complex-info-hover.component.css'
})
export class ComplexInfoHoverComponent {
  complex: any = {};
  formattedAddress: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.complex = this.data.complex;
    this.formatAddress();

  }
  formatAddress() {
    let result = "";
    if (this.complex.addressLine1 !== null && this.complex.addressLine1 !== undefined) {
      result = result +  this.complex.addressLine1 + "";
    }

    if (this.complex.addressLine2 !== null && this.complex.addressLine2 !== undefined) {
      result = result +  "\n" + this.complex.addressLine2;
    }

    if (this.complex.suburb !== null && this.complex.suburb !== undefined) {
      result = result +  "\n" + this.complex.suburb;
    }

    if (this.complex.city !== null && this.complex.city !== undefined) {
      result = result + "\n" + this.complex.city;
    }

     if (this.complex.province !== null && this.complex.province !== undefined) {
      result = result +  "\n" + this.complex.province;
    }

    if (this.complex.postalcode !== null && this.complex.postalcode !== undefined) {
      result = result +  "\n" + this.complex.postalcode;
     }
    
    this.formattedAddress = result;
  }


}
