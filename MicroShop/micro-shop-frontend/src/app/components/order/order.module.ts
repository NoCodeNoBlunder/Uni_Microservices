
// TODO DO we need all of these?
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { AppRoutingModule } from "../../app-routing.module";
import { OrderComponent } from "./order.component";
import { ReactiveFormsModule } from "@angular/forms";


@NgModule({
  declarations: [
    OrderComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    RouterModule,
    ReactiveFormsModule,
  ]
})
export class OrderModule { }


