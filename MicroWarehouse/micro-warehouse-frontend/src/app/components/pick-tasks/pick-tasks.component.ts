import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
// TODO need a different location for these schemas they are used by both front and backend.


@Component({
  selector: 'app-pick-tasks',
  templateUrl: './pick-tasks.component.html',
  styleUrls: ['./pick-tasks.component.scss']
})
export class PickTasksComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  public pickTasks: any[] = []
  debugString = ""

  ngOnInit(): void {
    // Get request Query to get picktasks via app.controller in warehouse backnd.
    this.http.get<any>('http://localhost:3000/query/OrdersToPick')
      .subscribe(
        answer => this.handleQueryResponse(answer),
        error => this.debugString = JSON.stringify(error, null, 3)
      );
  }

  handleQueryResponse(answer: any) {
    console.log('there is some date')
    for (const event of answer) {
      this.pickTasks.push(event);
    }
    this.debugString = `/query/palettes response contains ${this.pickTasks.length} palettes`
    console.log(this.debugString)
  }

  changeStatus(orderID: string, status: string) {
    console.log("row clicked with orderID " + orderID)
    console.log("row clicked with status " + status)
    if (status === "order placed") {
      this.router.navigate(['pick-tasks/edit-pick', orderID])
    }
    else if (status === 'picking') {
      this.router.navigate(['pick-tasks/confirm-delivery', orderID])
    }

  }
}
