import { Routes } from '@angular/router';

import { OrdenCompraCompradorBuscarComponent } from './comprador/buscar/ordencompracompradorbuscar.component';
import { OrdenCompraCompradorFormularioComponent } from './comprador/formulario/ordencompracompradorformulario.component';
import { OrdenCompraProveedorBuscarComponent } from './proveedor/buscar/ordencompraproveedorbuscar.component';
import { OrdenCompraProveedorFormularioComponent } from './proveedor/formulario/ordencompraproveedorformulario.component';
import { OrdenCompraCompradorIngresoOCComponent } from './comprador/ingresooc/ordencompracompradoringresooc.component';


export const OrdenCompraRoutes: Routes = [
  {

    path: '',
    children: [


      {
        path: 'comprador/buscar',
        component: OrdenCompraCompradorBuscarComponent
      },
      {
        path: 'comprador/ingresooc',
        component: OrdenCompraCompradorIngresoOCComponent
      },
      {
        path: 'comprador/formulario/:id',
        component: OrdenCompraCompradorFormularioComponent
      },

      {
        path: 'proveedor/buscar',
        component: OrdenCompraProveedorBuscarComponent
      },

      {
        path: 'proveedor/formulario/:id',
        component: OrdenCompraProveedorFormularioComponent
      },
    ]
  }
];
