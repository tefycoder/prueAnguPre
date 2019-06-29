import { Routes } from '@angular/router';

import { GrupoEmpresarialAdminEbizBuscarComponent } from './adminebiz/buscar/grupoempresarialadminebizbuscar.component';
import { GrupoEmpresarialAdminEbizFormularioComponent } from './adminebiz/formulario/grupoempresarialadminebizformulario.component';
import { GrupoEmpresarialAdminEbizDetalleComponent } from './adminebiz/detalle/grupoempresarialadminebizdetalle';

export const GrupoEmpresarialRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'adminebiz/buscar',
        component: GrupoEmpresarialAdminEbizBuscarComponent
      },
      {
        path: 'adminebiz/formulario/:id',
        component: GrupoEmpresarialAdminEbizFormularioComponent
      },
      {
        path: 'adminebiz/detalle/:id',
        component: GrupoEmpresarialAdminEbizDetalleComponent
      },
        
    ]
  }
];
