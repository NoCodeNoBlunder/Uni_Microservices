import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";


@Component({
  selector: 'app-edit-pick',
  templateUrl: './edit-pick.component.html',
  styleUrls: ['./edit-pick.component.scss']
})
export class EditPickComponent implements OnInit {

  public productID = ''
  public locations = ''
  public product = ''
  public state = ''

  public formGroup = new FormGroup({
    // Validater is a function that is called whenever something is changed in the Input field.
    product: new FormControl('', [Validators.required /*, this.productNameValidator()*/]),
    location: new FormControl('', [Validators.required , this.productLocationValidator()]),
  });

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute, // INFO gives access to the current route.
    // private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productID = params['code'] // TODO does this work?

      // Get GET product with the correct id.
      console.log("edit pick tasks WH FE id params " + JSON.stringify(params, null, 3));

      this.http.get<any>('http://localhost:3000/query/OrdersToPick_' + this.productID)
        .subscribe(
          answer => {
            console.log("edit pick tasks WH FE location: " + JSON.stringify(answer, null, 3));
            this.locations = answer.locations;
            this.product = answer.product;
            this.state = answer.state;
            this.formGroup.get('product')?.setValue(this.product);
          },
          error => { console.log("Problem picking: location" + JSON.stringify(error, null, 3));}
        );
    })
  }

  private productLocationValidator() {
    return (control : AbstractControl): ValidationErrors | null => {
      const forbidden = this.locations.indexOf(control.value) < 0
      return forbidden ? {forbiddenName: {value: control.value}} : null;
    }
  }

  submitPickTask() {
    console.log("submitPickTask called!")

    const pickDone = {
      code: this.productID,
      product: this.product,
      state: "picking",
      location: this.formGroup.get("location")?.value
    }

    console.log(JSON.stringify(pickDone, null, 3));

    this.http.post<any>('http://localhost:3000/cmd/pickDone', pickDone).subscribe(
      () => {
        // this.toastService.success("PickTask", 'Picktasks completed successfully!')
        this.router.navigate(["pick-tasks"])
      },
      (error) => {
        // this.toastService.error("Edit Pick-Task", `Problem`, error)
      }
    )
  };
}
