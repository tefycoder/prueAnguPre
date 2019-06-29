import { Routes } from '@angular/router';

import { ContratosAdminEbizBuscarComponent } from './adminebiz/buscar/contratosadminebizbuscar.component';
import { ContratosAdminEbizFormularioComponent } from './adminebiz/formulario/contratosadminebizformulario.component';

export const ContratosRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'adminebiz/buscar',
        component: ContratosAdminEbizBuscarComponent
      },
      {
        path: 'adminebiz/formulario/:id',
        component: ContratosAdminEbizFormularioComponent
      },
        
    ]
  }
];
