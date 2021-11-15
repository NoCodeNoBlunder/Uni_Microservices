/**
 * What is this file doing? Create a god damn UML diagramm.
 */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeModule} from "./components/home/home.module";
import { StoreTasksModule } from "./components/store-tasks/store-tasks.module";
import { AddPaletteModule } from "./components/add-palette/add-palette.module";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [ // Imports these Modules to the top level so the router module can access them.
    BrowserModule,
    AppRoutingModule,
    HomeModule,
    StoreTasksModule,
    AddPaletteModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
