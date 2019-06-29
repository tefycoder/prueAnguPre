import { Routes } from '@angular/router';

import { OrganizacionAdminEbizBuscarComponent } from './adminebiz/buscar/organizacionadminebizbuscar.component';
import { OrganizacionAdminEbizFormularioComponent } from './adminebiz/formulario/organizacionadminebizformulario.component';
import { OrganizacionAdminEbizDetalleComponent } from './adminebiz/detalle/organizacionadminebizdetalle.component';

export const OrganizacionRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'adminebiz/buscar',
        component: OrganizacionAdminEbizBuscarComponent
      },
      {
        path: 'adminebiz/formulario/:id',
        component: OrganizacionAdminEbizFormularioComponent
      },
      {
        path: 'adminebiz/detalle/:id',
        component: OrganizacionAdminEbizDetalleComponent
      },
        
    ]
  }
];
