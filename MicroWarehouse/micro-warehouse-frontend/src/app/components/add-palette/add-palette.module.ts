import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddPaletteComponent } from './add-palette.component';
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule, // Allows us to use input forms.
    BrowserModule,
  ]
})
export class AddPaletteModule { }
