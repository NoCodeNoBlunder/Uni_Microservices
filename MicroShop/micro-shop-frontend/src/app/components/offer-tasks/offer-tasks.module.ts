

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { AppRoutingModule } from "../../app-routing.module";
import { OfferTasksComponent } from "./offer-tasks.component";


@NgModule({
  /**
   * This declares the module.
   */
  declarations: [
    OfferTasksComponent
  ],
  /**
   * THis imports the needed modules
   */
  imports: [
    CommonModule,
    AppRoutingModule,
    RouterModule,
  ]
})
export class OfferTasksModule { }
