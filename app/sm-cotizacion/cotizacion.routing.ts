import { Routes } from '@angular/router';


import { CotizacionCompradorFormularioComponent } from './comprador/formulario/cotizacioncompradorformulario.component';
import { CotizacionCompradorBuscarComponent } from './comprador/buscar/cotizacioncompradorbuscar.component';
import { CotizacionProveedorFormularioComponent } from './proveedor/formulario/cotizacionproveedorformulario.component';
import { CotizacionProveedorBuscarComponent } from './proveedor/buscar/cotizacionproveedorbuscar.component';
import { CotizacionProveedorCrearComponent } from './proveedor/crear/cotizacionproveedorcrear.component';

import {AuthGuardService} from "app/service/auth-guard.service";

export const CotizacionRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'comprador/buscar',
        component: CotizacionCompradorBuscarComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'comprador/formulario/:id',
        component: CotizacionCompradorFormularioComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'proveedor/buscar',
        component: CotizacionProveedorBuscarComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'proveedor/formulario/:id',
        component: CotizacionProveedorFormularioComponent,
        canActivate: [AuthGuardService]
      },      
      {
        path: 'proveedor/crear/:id',
        component: CotizacionProveedorCrearComponent,
        canActivate: [AuthGuardService]
      }

    ]
  }
];
