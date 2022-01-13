import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.component.html',
  styleUrls: ['./edit-offer.component.scss']
})
export class EditOfferComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  validNames: string[] = ['jeans', 'tshirt'];

  formGroup = new FormGroup({
    // Validater is a function that is called whenever something is changed in the Input field.
    productName: new FormControl('', [Validators.required, this.productNameValidator()]),
    productPrice: new FormControl('', [
      Validators.required,
      Validators.pattern(/^([1-9][0-9]*)$|^([0-9]*(\.|,)[0-9]?[1-9])$/)
    ])
  });

  productNameValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const forbidden = this.validNames.indexOf(control.value) < 0; // check if the name is in the validNames.
      return forbidden ? {forbiddenName: {value: control.value}} : null; // if it is forbidden we return an error message.
    };
  }

  // productNameError(control: AbstractControl) {
  //   const forbidden = this.validNames.indexOf(control.value) < 0;
  //   return forbidden ? {forbiddenName: {value: control.value}} : null; // if it is forbidden we return an error message.
  // }

  debugOut = "Hello edit offer";

  submitOffer() {
    this.debugOut = `Your input is ${this.formGroup.get('productName')?.value}`;
  }
}
