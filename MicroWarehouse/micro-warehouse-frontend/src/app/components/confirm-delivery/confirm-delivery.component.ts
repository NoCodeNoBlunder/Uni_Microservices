import {asNativeElements, Component, OnInit} from '@angular/core';
import { HttpClient} from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { environment } from "../../../environments/environment.prod";

@Component({
  selector: 'app-confirm-delivery',
  templateUrl: './confirm-delivery.component.html',
  styleUrls: ['./confirm-delivery.component.scss']
})
export class ConfirmDeliveryComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  public OrderID = ''
  public product = ''
  public address = ''
  public location = ''
  public palette = ''

  // this.productState = answer.state;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.OrderID = params['code'] // TODO does this work?

      // Get GET product with the correct id.
      console.log("edit pick tasks WH FE id params " + JSON.stringify(params, null, 3));

      // TODO I might even want another query to just get the order that are in picking.
      this.http.get<any>(environment.baseurl + 'query/OrdersToPick_' + this.OrderID)
        .subscribe(
          answer => {
            console.log("edit pick tasks WH FE location: " + JSON.stringify(answer, null, 3));
            this.product = answer.product;
            this.address = answer.address;
            this.location = answer.locations;
            this.palette = answer.palette;
          },
          error => { console.log("Problem picking: location" + JSON.stringify(error, null, 3));}
        );
    })
  }

  submitDelivery() {
    const delivery = {
      code: this.OrderID,
      state: "shipped"
    }

    this.http.post<any>(environment.baseurl + 'cmd/shipped', delivery).subscribe(
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
