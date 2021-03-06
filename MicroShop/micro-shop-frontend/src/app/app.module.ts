

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { HomeModule } from "./components/home/home.module";
import { OfferTasksModule } from "./components/offer-tasks/offer-tasks.module";
import { EditOfferModule } from "./components/edit-offer/edit-offer.module";
import { OrderModule } from "./components/order/order.module"
import { ToastModule, ToastService,} from "ng-bootstrap-ext";


@NgModule({
  declarations: [
    AppComponent,
  ],

  /**
   * Specifies what Modules this 'project has to import'
   */
  imports: [ // Imports these Modules to the top level so the router module can access them.
    // Angular Modules.
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastModule,
    // Our Modules.
    HomeModule,
    OfferTasksModule,
    EditOfferModule,
    OrderModule,
  ],
  providers: [ToastService],
  bootstrap: [AppComponent]
})
export class AppModule { }
