import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-offer-tasks',
  templateUrl: './offer-tasks.component.html',
  styleUrls: ['./offer-tasks.component.scss']
})
export class OfferTasksComponent implements OnInit {

  constructor(private http: HttpClient) { }

  public offers: any[] = [];

  storeTaskString = "Hello offer Tasks";

  ngOnInit(): void {

    // Dummy Data.
    this.offers.push({
      name: "jeans",
      state: "in stock",
      amount: 6,
      price: 0.0,
    });
    this.offers.push({
      name: "tshirt",
      state: "in stock",
      amount: 7,
      price: 0.0,
    });

    this.storeTaskString = `number of offers ${this.offers.length}`

    /*
    this.http.get<any>('http://localhost:3100/query/products')
      .subscribe(
        answer => this.handleQueryResponse(answer),
        error => this.storeTasksString = JSON.stringify(eror, null, 3)
      );*/

  }
}
