import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreTasksComponent } from './store-tasks.component';
import { RouterModule } from "@angular/router";


@NgModule({
  declarations: [
    StoreTasksComponent
  ],
    imports: [
        CommonModule,
        RouterModule,
    ]
})
export class StoreTasksModule { }
