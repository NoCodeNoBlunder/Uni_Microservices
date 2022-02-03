import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastService } from 'ng-bootstrap-ext';
import { ProductDto } from "../../../common/ProductDto";

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.component.html',
  styleUrls: ['./edit-offer.component.scss']
})
export class EditOfferComponent implements OnInit {

  validNames: string[] = ['jeans', 'tshirt'];

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    //this.toastService.success("Welcome to Edit Offer", "hello edit offer");
    this.http.get<any>('http://localhost:3100/query/products')
      .subscribe(
        answer => this.handleQueryResponse(answer),
        error => this.debugOut = JSON.stringify(error, null, 3)
      );
  }

  handleQueryResponse(answer: ProductDto[]) {
    this.validNames = [];
    for (const elem of answer) {
      //console.log(JSON.stringify(product, null, 3))
      this.validNames.push(elem.product);
    }
    this.debugOut = `valid names: ${this.validNames}`
  }

  // TODO kann ich das nach oben moven?
  formGroup = new FormGroup({
    // Validater is a function that is called whenever something is changed in the Input field.
    productName: new FormControl('', [Validators.required, this.productNameValidator()]),
    productPrice: new FormControl('', [Validators.required, this.productPriceValidator()]),
  });

  productNameValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const forbidden = this.validNames.indexOf(control.value) < 0;
      return forbidden ? {forbiddenName: {value: control.value}} : null; // if it is forbidden we return an error message.
    };
  }

  productPriceValidator() { //Bootstrap form Validation
    return (control: AbstractControl): ValidationErrors | null => {
      const forbidden = control.value <= 0;
      return forbidden ? {forbiddenPrice: {value: control.value}} : null; // if it is forbidden we return an error message.
    };
  }

  productNameError(control: AbstractControl) {
    const forbidden = this.validNames.indexOf(control.value) < 0;
    return forbidden ? {forbiddenName: {value: control.value}} : null; // if it is forbidden we return an error message.
  }

  debugOut = "Hello edit offer";

  submitOffer() {
    this.debugOut = `Your input is ${this.formGroup.get('productName')?.value}`;
    const params = {
      product: this.formGroup.get('productName')?.value,
      price: Number(this.formGroup.get('productPrice')?.value),
    }
    this.http.post<any>('http://localhost:3100/cmd/setPrice', params).subscribe(
      () => {
        this.toastService.success('Edit Offer', 'Price has been stored successfully !!!');
        this.router.navigate(['offer-tasks']);
      },
      (error) => {
        this.toastService.error('Edit Offer', `Problem:`, error);
      }
    )
  }
}
