import { Routes } from '@angular/router';

import { UsuarioAdminEbizBuscarComponent } from './adminebiz/buscar/usuarioadminebizbuscar.component';
import { UsuarioAdminEbizFormularioComponent } from './adminebiz/formulario/usuarioadminebizformulario.component';

export const UsuarioRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'adminebiz/buscar',
        component: UsuarioAdminEbizBuscarComponent
      },
      {
        path: 'adminebiz/formulario/:id',
        component: UsuarioAdminEbizFormularioComponent
      },
        
    ]
  }
];
