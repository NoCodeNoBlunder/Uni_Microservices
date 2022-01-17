import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { ToastService } from "ng-bootstrap-ext";


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
    this.http.get<any>("hppt://localhost:3100/query/products")
      .subscribe(
        answer => this.handleQueryResponse(answer),
        error => this.debugOut = JSON.stringify(error, null, 3)
      )
  }

  // Makes sure that valid names are not all the products stores in the db.
  handleQueryResponse(answer: any[]) {
    this.validNames = [];
    for (const elem of answer) {
      this.validNames.push(elem.product);
    }
    this.debugOut = `valid names: ${this.validNames}`
  }

  submitOffer() {
    this.debugOut = `Your input is ${this.formGroup.get('productName')?.value}`;
    const params = {
      product: this.formGroup.get('productName')?.value,
      price: Number(this.formGroup.get('productPrice')?.value),
    }
    // Check if the Input is valid in the backend also. There needs to be a check in the front and in the backend.
    this.http.post<any>("http://localhost:3100/cmd/setPrice", params).subscribe(
      () => {
        this.toastService.success("Edit Offer", "Price has been stored successfully!");
        this.router.navigate(["offer-tasks"]);
      },
      (error) => {
        this.toastService.error("Edit Offer", `Problem:: ${JSON.stringify(error, null, 3)}`);
      }
    );
  }

  formGroup = new FormGroup({
    // Validater is a function that is called whenever something is changed in the Input field.
    productName: new FormControl('', [Validators.required, this.productNameValidator()]),
    productPrice: new FormControl('', [
      Validators.required,
      // Validators.pattern(/^([1-9][0-9]*)$|^([0-9]*(\.|,)[0-9]?[1-9])$/)
    ])
  });

  productNameValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const forbidden = this.validNames.indexOf(control.value) < 0; // check if the name is in the validNames.
      return forbidden ? {forbiddenName: {value: control.value}} : null; // if it is forbidden we return an error message.
    };
  }

  debugOut = "Hello edit offer";
}
