import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from "./components/home/home.component";
import { StoreTasksComponent } from "./components/store-tasks/store-tasks.component";
import { AddPaletteComponent } from "./components/add-palette/add-palette.component";
import { PickTasksComponent } from "./components/pick-tasks/pick-tasks.component";
import { EditPickComponent } from "./components/edit-pick/edit-pick.component";
import { DeliverOrdersComponent } from "./components/deliver-orders/deliver-orders.component";


// Stores a reference to all different kinds of pages in our web application.
// It is responsible to direct us the the correct componets.
const routes: Routes = [
  { path: "home", component: HomeComponent }, // So a component is the webpage?
  { path: "store-tasks", component: StoreTasksComponent },
  { path: "store-tasks/add-palette", component: AddPaletteComponent },
  { path: "pick-tasks", component: PickTasksComponent },
  { path: 'pick-tasks/edit-pick', component: EditPickComponent},
  { path: 'pick-tasks/edit-pick/:code', component: EditPickComponent},
  { path: 'deliver-orders', component: DeliverOrdersComponent},
  { path: "", component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
