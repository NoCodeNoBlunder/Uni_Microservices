import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-store-tasks',
  templateUrl: './store-tasks.component.html',
  styleUrls: ['./store-tasks.component.scss']
})
export class StoreTasksComponent implements OnInit {

  constructor() { }

  // List of jason objects?
  palletes = [
    {
      barcode: "b001",
      product: "red shoes",
      amount: 10,
      location: "shelf 42"
    },
    {
      barcode: "b002",
      product: "blue shoes",
      amount: 10,
      location: "shelf 43"
    },
    {
      barcode: "b003",
      product: "yellow shoes",
      amount: 2,
      location: "shelf 44"
    },
  ]

  storeTaskString = "Test"

  // This method is called when the page the component lives on
  // is loaded basically a constructor.
  ngOnInit(): void {

  }
}
