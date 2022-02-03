import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-deliver-orders',
  templateUrl: './deliver-orders.component.html',
  styleUrls: ['./deliver-orders.component.scss']
})
export class DeliverOrdersComponent implements OnInit {

  public pickTasks: any[] = [{code: "test1337", product: "testproduct", customer: "testosterone", address: "worldoftest", state: "testing"}];
  debugString = ""

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Get request Query to get picktasks via app.controller in warehouse backend.
    this.http.get<any>('http://localhost:3000/query/OrdersToPick')
      .subscribe(
        answer => this.handleQueryResponse(answer),
        error => this.debugString = JSON.stringify(error, null, 3)
      );
  }

  handleQueryResponse(answer: any) {
    //this.pickTasks = []
    console.log('there is some data')
    for (const task of answer) {
      this.pickTasks.push(task);
    }
    this.debugString = `/query/palettes response contains ${this.pickTasks.length} palettes`
    console.log(this.debugString)
  }

}
