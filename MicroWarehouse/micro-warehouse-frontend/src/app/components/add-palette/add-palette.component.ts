import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-palette',
  templateUrl: './add-palette.component.html',
  styleUrls: ['./add-palette.component.scss']
})
export class AddPaletteComponent implements OnInit {

  constructor() { }

  barcode = ""

  product = ""

  amount = ""

  location = ""

  addPalette() {
    const newPalette = { // We need to specify a need variable is comeing up with const.
      barcode: this.barcode,
      product: this.product,
      amoun: this.amount,
      location: this.location,
    }

    // Prints to browser console in a nice formated way.
    console.log(JSON.stringify(newPalette, null, 3))

    // storeTasks.palletes.add(newPalette)
  }

  ngOnInit(): void {
  }

}
