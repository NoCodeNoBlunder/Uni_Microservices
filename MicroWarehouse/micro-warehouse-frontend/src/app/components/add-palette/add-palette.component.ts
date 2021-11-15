import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { newArray } from "@angular/compiler/src/util";
import { Router } from "@angular/router";

@Component({
  selector: 'app-add-palette',
  templateUrl: './add-palette.component.html',
  styleUrls: ['./add-palette.component.scss']
})
export class AddPaletteComponent implements OnInit {

  /**
   * Inject inject the router in your component constructor
   */
  constructor(private  http: HttpClient, private router: Router) { };

  barcode = ""

  product = ""

  amount = ""

  location = ""

  ngOnInit(): void {
  }

  async addPalette() {
    const newPalette = {
      barcode: this.barcode,
      product: this.product,
      amount: this.amount,
      location: this.location,
    }

    /**
     * We create a new command here. So when new data is entered in the frontend and we want to store
     * it we create a new event and store it in the database.
     */
    const newCmd = {
      opCode: 'storePalette', // will decide which event type it is.
      parameters: newPalette, // parameters will be the payload.
    }

    /**
     * This operation might fail if the database cannot return the data. I.e the cloud is down.
     * Therefore We use exception handling.
     */
    try {
      const response = await this.http.post<any>('http://localhost:3000/cmd', newCmd).toPromise();
      console.log(`post has been send ${JSON.stringify(response, null, 3)}`);
      await this.router.navigate(['/store-tasks']);
    } catch (error) {
      console.log(`post error`)
    }
  }
}
