import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from "@angular/forms";
import { RouterModule } from "@angular/router";
import { AppRoutingModule } from "../../app-routing.module";



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AppRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class EditPickModule { }
