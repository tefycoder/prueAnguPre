import { Routes } from '@angular/router';

import { AccesoOrganizacionAdminEbizBuscarComponent } from './adminebiz/buscar/accesoorganizacionadminebizbuscar.component';
import { AccesoOrganizacionAdminEbizFormularioComponent } from './adminebiz/formulario/accesoorganizacionadminebizformulario.component';

export const AccesoOrganizacionRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'adminebiz/buscar',
        component: AccesoOrganizacionAdminEbizBuscarComponent
      },
      {
        path: 'adminebiz/formulario/:id',
        component: AccesoOrganizacionAdminEbizFormularioComponent
      },
        
    ]
  }
];
