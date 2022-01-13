
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from "../../app-routing.module";
import { EditOfferComponent } from "./edit-offer.component";
import { ReactiveFormsModule } from "@angular/forms";


@NgModule({
  declarations: [
    EditOfferComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    ReactiveFormsModule,
  ]
})
export class EditOfferModule { }
