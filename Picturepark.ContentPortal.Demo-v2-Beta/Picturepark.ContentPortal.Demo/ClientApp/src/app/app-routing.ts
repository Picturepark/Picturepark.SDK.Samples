import { DashboardComponent } from './components/dashboard/dashboard.component';
import { Routes } from '@angular/router';
import { ItemsComponent } from './components/items/items.component';
import { PresskitComponent } from './components/presskit/presskit.component';

export const APP_ROUTES: Routes = [
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
