import { Component, OnInit } from '@angular/core';
import  { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router} from "@angular/router";
import { ToastService } from "ng-bootstrap-ext";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  public debugOut = "Hello order";
  public product = 'no product';

  public formGroup = new FormGroup({
    order: new FormControl("", [Validators.required]),
    product: new FormControl("", [Validators.required]),
    customer: new FormControl("", [Validators.required]),
    address: new FormControl("", [Validators.required]),
  });


  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute, // INFO gives access to the current route.
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.product = params["product"]
      // TODO HA change toISOString with uuid HOmework Min: 49:47!
      // uuid generates id.
      // TODO TImestmamp instead of totally random id.
      this.formGroup.get('order')?.setValue(uuidv4())
      this.formGroup.get('product')?.setValue(this.product)
    })
  }

  /* React to submit Button click. */
  submitOffer() {
    this.debugOut = `Your name is ${this.formGroup.get('customer')?.value}`;
    const params = {
      order: this.formGroup.get('order')?.value,
      product: this.formGroup.get('product')?.value,
      customer: this.formGroup.get('customer')?.value,
      address: this.formGroup.get('address')?.value,
    }


    this.http.post<any>("http://localhost:3100/cmd/placeOrder", params).subscribe(
      () => {
        // If it works show that it did with toast and navigate to home.
        this.toastService.success("Order", 'order submitted succesfully!');
        this.router.navigate(["home", this.formGroup.get('customer')?.value]);
      },
      (error) => {
        this.toastService.error("Edit Offer", `Problem:`, error);
      });
  }
}
