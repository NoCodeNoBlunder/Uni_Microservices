import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Component, Injectable, OnInit} from '@angular/core';

@Component({
  selector: 'app-store-tasks',
  templateUrl: './store-tasks.component.html',
  styleUrls: ['./store-tasks.component.scss']
})
export class StoreTasksComponent implements OnInit {

  constructor(private  http: HttpClient) { };

  public palettes: any[] = [ ]; // Here the frontend stores all palettes.

  storeTaskString = "Hello Students"

  // answer: any = { };

  ngOnInit() {
    this.http
      .get<any>('http://localhost:3000/query/palettes')
      .subscribe(
        // If it succeeds do this
        answer => this.handleQueryResponse(answer),
        // If there is an error do this.
        error => this.storeTaskString = JSON.stringify(error, null, 3)
      );
  }

  handleQueryResponse(answer: any) {
    console.log('there is some date')
    for (const event of answer.result) {
      this.palettes.push(event.payload);
    }
    this.storeTaskString = `/query/palettes response contains ${this.palettes.length} palettes`
    console.log(this.storeTaskString)
  }
}

