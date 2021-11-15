import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Component, Injectable, OnInit} from '@angular/core';

@Component({
  selector: 'app-store-tasks',
  templateUrl: './store-tasks.component.html',
  styleUrls: ['./store-tasks.component.scss']
})
export class StoreTasksComponent implements OnInit {

  constructor(private  http: HttpClient) { };

  public palettes: any[] = [ ];

  storeTaskString = "Hello Students"

  answer: any = { };

  /**
   * Get called when the component store-tasks is opened.
   */
  async ngOnInit() {
    this.answer = await this.http // Make sure the result is computed before you continue.
      .get<any>('http://localhost:3000/query/palettes')
      .toPromise();
    console.log('there is some data');
    for (const event of this.answer.result) {
      this.palettes.push(event.payload); // payloads is what we are interessted in.
    }

    console.log(this.storeTaskString);
  }
}
