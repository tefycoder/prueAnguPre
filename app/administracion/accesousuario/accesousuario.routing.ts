import { Routes } from '@angular/router';

import { AccesoUsuarioAdminEbizBuscarComponent } from './adminebiz/buscar/accesousuarioadminebizbuscar.component';
import { AccesoUsuarioAdminEbizFormularioComponent } from './adminebiz/formulario/accesousuarioadminebizformulario.component';

export const AccesoUsuarioRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'adminebiz/buscar',
        component: AccesoUsuarioAdminEbizBuscarComponent
      },
      {
        path: 'adminebiz/formulario/:id',
        component: AccesoUsuarioAdminEbizFormularioComponent
      },
        
    ]
  }
];
