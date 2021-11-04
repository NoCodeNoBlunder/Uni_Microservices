import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeModule} from "./components/home/home.module";
import { StoreTasksModule } from "./components/store-tasks/store-tasks.module";
import { AddPaletteModule } from "./components/add-palette/add-palette.module";
import { FormsModule } from "@angular/forms";

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
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
