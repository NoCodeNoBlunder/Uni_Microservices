import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {environment} from "../../../environments/environment.prod";
//import { ConsoleReporter } from 'jasmine';
//import { StoreTasksComponent } from '../store-tasks/store-tasks.component';

@Component({
  selector: 'app-add-palette',
  templateUrl: './add-palette.component.html',
  styleUrls: ['./add-palette.component.scss']
})
export class AddPaletteComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router) { }

  barcode = ''
  product = ''
  amount = ''
  location = ''

  ngOnInit(): void {
  }

  async addPalette() {
    const newPalette = {
      barcode: this.barcode,
      product: this.product,
      amount: this.amount,
      location: this.location
    }

    const newCmd = {
      opCode: 'storePalette',
      parameters: newPalette,
    }

    //try {
    //  const response = await this.http.post<any>('http://localhost:3000/cmd', newCmd).toPromise();
    //  console.log(`post has been sent ${JSON.stringify(response, null, 3)}`);
    //  await this.router.navigate(['/store-tasks']);
    //} catch (error) {
    //  console.log(`post error`);
    //}
    //console.log(JSON.stringify(newCmd, null, 3))

    this.http.post<any>(environment.baseurl + 'cmd', newCmd).subscribe(
      () => this.router.navigate(['store-tasks'])
    );
  }

}
