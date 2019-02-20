import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ItemsComponent } from './components/items/items.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: '',
    redirectTo: 'items/',
    pathMatch: 'full'
  },
  {
    path: 'items',
    component: ItemsComponent,
  },
  {
    path: 'items/:channelId',
    component: ItemsComponent,
  },
  {
    path: 'items/:channelId/:itemId',
    component: ItemsComponent,
    pathMatch: 'full'
  },
  // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
