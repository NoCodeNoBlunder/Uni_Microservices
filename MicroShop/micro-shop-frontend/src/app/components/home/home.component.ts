import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public customer = "";
  public offers: any[] = [];
  public orders: any[] = [];
  public debugString = 'Hello on sale page';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['customer']) {
        this.customer = params['customer']
        this.http.get<any>('http://localhost:3100/query/orders_' + this.customer)
          .subscribe(
            answer => this.handleOrderList(answer),
            error => this.debugString = JSON.stringify(error, null, 3)
          );
      }
    })
    this.http.get<any>('http://localhost:3100/query/products')
      .subscribe(
        answer => this.handleQueryResponse(answer),
        error => this.debugString = JSON.stringify(error, null, 3)
      );
  }

  handleQueryResponse(answer: any[]) {
    this.offers = [];
    for (const product of answer) {
      if (product.price > 0) {
        this.offers.push(product);
      }
    }
    this.debugString = `Distinct products: ${this.offers.length}`
  }

  // Tell the customer how many active orders he has.
  handleOrderList(answer: any[]) {
    this.orders = [];
    for (const order of answer) {
      this.orders.push(order);
    }
    this.customer = `${this.customer}, you have ${this.orders.length} active order(s)`
  }
}
