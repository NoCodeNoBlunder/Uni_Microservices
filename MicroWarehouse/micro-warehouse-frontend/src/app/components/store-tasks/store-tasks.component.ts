import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http'
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-store-tasks',
  templateUrl: './store-tasks.component.html',
  styleUrls: ['./store-tasks.component.scss']
})
export class StoreTasksComponent implements OnInit {

  constructor(private http: HttpClient) { };

  public palettes: any = [];

  storeTaskString = "Hello Student"

  //answer : any = { };

  ngOnInit() {
    const c = this.http.get<any>('http://localhost:3000/query/palettes')
      .subscribe(
        answer => this.handleQueryResponse(answer),
        error => this.storeTaskString = JSON.stringify(error, null, 3)
      );
    // console.log("[store-tasks.component] ngOnInit query palettes result is: " + JSON.stringify(c, null, 3));
  }

  handleQueryResponse(answer: any) {
    console.log("[store-task.component] handeQueryResponse get pased answer: " + JSON.stringify(answer, null, 3));
    for (const event of answer.result) {
      this.palettes.push(event.payload);
    }
    this.storeTaskString = `/query/palettes response contains ${this.palettes.length} palettes`
    console.log(this.storeTaskString)
  }
}
