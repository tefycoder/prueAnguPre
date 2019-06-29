import { Routes } from '@angular/router';

import { ModuloAdminEbizBuscarComponent } from './adminebiz/buscar/moduloadminebizbuscar.component';
import { ModuloAdminEbizFormularioComponent } from './adminebiz/formulario/moduloadminebizformulario.component';

export const ModuloRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'adminebiz/buscar',
        component: ModuloAdminEbizBuscarComponent
      },
      {
        path: 'adminebiz/formulario/:id',
        component: ModuloAdminEbizFormularioComponent
      },
        
    ]
  }
];
