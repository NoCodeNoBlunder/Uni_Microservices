import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule } from "@angular/router";


// Creates datastructure within our angular universe. Handles In- and Export.
// Tables can be imported as needed without overly polluting the global namespace.
@NgModule({
  declarations: [],
    imports: [
        CommonModule,
        RouterModule,
        // Imports the CommonModule which is a Angular default package?
    ]
})
export class HomeModule { }
