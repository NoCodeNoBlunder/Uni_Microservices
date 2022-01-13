/**
 * Go throught different pages of the web aplication and tell how to get there.
 * Decyphers/ Decodes the URL and tell the application which page to load.
 * Bind URL(suffix) to a component of the web application.
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from "./components/home/home.component"
import { EditOfferComponent } from "./components/edit-offer/edit-offer.component"
import { OfferTasksComponent } from "./components/offer-tasks/offer-tasks.component";

const routes: Routes = [
  { path: "home", component: HomeComponent},
  { path: "offer-tasks/edit-offer", component: EditOfferComponent },
  { path: "offer-tasks", component: OfferTasksComponent },
  { path: "", component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
