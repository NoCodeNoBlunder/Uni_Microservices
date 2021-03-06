/**
 * What is this file doing? Create a god damn UML diagramm.
 */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeModule} from "./components/home/home.module";
import { StoreTasksModule } from "./components/store-tasks/store-tasks.module";
import { AddPaletteModule } from "./components/add-palette/add-palette.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { PickTasksModule } from "./components/pick-tasks/pick-tasks.module";
import { EditPickComponent } from './components/edit-pick/edit-pick.component';
import { AddPaletteComponent }  from "./components/add-palette/add-palette.component";
import { PickTasksComponent } from "./components/pick-tasks/pick-tasks.component";
import { HomeComponent } from "./components/home/home.component";
import { StoreTasksComponent } from "./components/store-tasks/store-tasks.component";
import { ConfirmDeliveryComponent } from './components/confirm-delivery/confirm-delivery.component';
import { ConfirmDeliveryModule } from "./components/confirm-delivery/confirm-delivery.module";
// import { ToastModule, ToastService,} from "ng-bootstrap-ext"; // TODO Install Toast in warehouse

@NgModule({
  declarations: [
    HomeComponent, // This module provides a HomeComponent
    AppComponent,
    EditPickComponent,
    AddPaletteComponent,
    PickTasksComponent,
    StoreTasksComponent,
    ConfirmDeliveryComponent,
  ],
    imports: [ // Imports these Modules to the top level so the router module can access them.
        BrowserModule,
        AppRoutingModule,
        HomeModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        StoreTasksModule,
        AddPaletteModule,
        PickTasksModule,
        ConfirmDeliveryModule,
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
