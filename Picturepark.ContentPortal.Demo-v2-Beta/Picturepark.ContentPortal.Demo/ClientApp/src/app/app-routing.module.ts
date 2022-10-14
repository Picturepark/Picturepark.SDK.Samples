import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ItemsComponent } from './components/items/items.component';
import { PresskitComponent } from './components/presskit/presskit.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'items',
    component: ItemsComponent,
    children: [
      {
        path: ':channelId',
        component: ItemsComponent,
        children: [
          {
            path: ':itemId',
            component: ItemsComponent,
          },
        ],
      },
    ],
  },
  {
    path: 'presskit',
    component: PresskitComponent,
    pathMatch: 'full',
  },
  {
    path: 'presskit/:itemId',
    component: PresskitComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
