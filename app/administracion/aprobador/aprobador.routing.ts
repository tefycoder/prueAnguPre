import { Routes } from '@angular/router';

import { AprobadorAdminEbizBuscarComponent } from './adminebiz/buscar/aprobadoradminebizbuscar.component';

export const AprobadorRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'adminebiz/buscar',
        component: AprobadorAdminEbizBuscarComponent
      },        
    ]
  }
];
