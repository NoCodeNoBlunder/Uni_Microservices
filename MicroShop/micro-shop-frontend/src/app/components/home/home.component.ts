import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public offers: any[] = [];
  public debugString = 'Hello on sale page';

  constructor(
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
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
    this.debugString = `number of offers ${this.offers.length}`
  }

}
