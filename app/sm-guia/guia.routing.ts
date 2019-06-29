import { Routes } from '@angular/router';


import { GuiaProveedorFormularioComponent } from './proveedor/formulario/guiaproveedorformulario.component';
import { GuiaCompradorFormularioComponent } from './comprador/formulario/guiacompradorformulario.component';
import { GuiaProveedorBuscarComponent } from './proveedor/buscar/guiaproveedorbuscar.component';

import { GuiaCompradorBuscarComponent } from "app/sm-guia/comprador/buscar/guiacompradorbuscar.component";
import { AuthGuardService } from "app/service/auth-guard.service";


export const GuiaRoutes: Routes = [
  {
    path: '',
    children: [ {
      path: 'proveedor/formulario/:id',
      component: GuiaProveedorFormularioComponent,
        canActivate: [AuthGuardService]
      
    },
    {
      path: 'comprador/formulario/:id',
      component: GuiaCompradorFormularioComponent,
        canActivate: [AuthGuardService]
      
    },
      {
        path: 'proveedor/buscar',
        component: GuiaProveedorBuscarComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'comprador/buscar',
        component: GuiaCompradorBuscarComponent,
        canActivate: [AuthGuardService]
      }]
  }
];
