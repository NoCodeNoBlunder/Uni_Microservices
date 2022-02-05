import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ProductDto } from "../../../common/ProductDto";

@Component({
  selector: 'app-offer-tasks',
  templateUrl: './offer-tasks.component.html',
  styleUrls: ['./offer-tasks.component.scss']
})
export class OfferTasksComponent implements OnInit {

  constructor(
    private http: HttpClient,
  ) { }

  public offers: ProductDto[] = [];

  // Used for debugging.
  storeTaskString = "Hello offer Tasks";

  ngOnInit(): void {

    // // Dummy Data.
    // this.offers.push({
    //   // TODO changed this from name to product.
    //   product: "jeans",
    //   state: "in stock",
    //   amount: 6,
    //   price: 0.0,
    // });
    // this.offers.push({
    //   product: "tshirt",
    //   state: "in stock",
    //   amount: 7,
    //   price: 0.0,
    // });

    this.storeTaskString = `number of offers ${this.offers.length}`

    // Request for all the product in db.
    this.http.get<any>('http://localhost:3100/query/products')
      .subscribe(
        answer => this.handleQueryResponse(answer),
        error => this.storeTaskString = JSON.stringify(error, null, 3)
      );
  }

  handleQueryResponse(answer: ProductDto[]) {
    // Reset the offers. Ger rid of dummy data.
    this.offers = [];
    // For each product we have in dp push it to offers so they are available.
    for (const product of answer) {
        // console.log(JSON.stringify(product, null, 3))
        // Add all products to available offers.
        this.offers.push(product)
    }
    this.storeTaskString = `Dinstince products in Warehouse: ${this.offers.length}`
  }
}
