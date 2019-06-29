import { Routes, CanActivate  } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { AuthGuardService } from './service/auth-guard.service';

import * as routesFacturacionElectronica from './facturacion-electronica/facturacion-electronica.routing';

import { LoginComponent } from './login/login.component';
import { ConsultaClienteComponent } from 'app/cliente/consulta-cliente.component';
import { VisualizarComprobanteClienteComponent } from 'app/cliente/comprobantes-visualizar/visualizar-comprobante-cliente.component';

export const AppRoutes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    {
        path: '',
        redirectTo: 'recuperarpassword',
        pathMatch: 'full',
    },
    {
        path: '',
        component: AdminLayoutComponent,
        canActivateChild: [AuthGuardService],
        children: [
            {
                path: 'ordencompra',
                loadChildren: './ordencompra/ordencompra.module#OrdenCompraModule',
                canActivate: [AuthGuardService]
            },
            {
                path: 'guia',
                loadChildren: './guia/guia.module#GuiaModule',
                canActivate: [AuthGuardService]
            },
            {
                path: 'conformidadservicio',
                loadChildren: './conformidadservicio/conformidadservicio.module#ConformidadServicioModule',
                canActivate: [AuthGuardService]
            },
            {
                path: 'factura',
                loadChildren: './factura/factura/factura.module#FacturaModule',
                canActivate: [AuthGuardService]
            },
            {
                path: 'solpago',
                loadChildren: './solpago/solpago.module#SolpagoModule',
                canActivate: [AuthGuardService]
            },
            {
                path: 'confparametros',
                loadChildren: './factoring/parametros/parametros.module#ParametrosModule',
                canActivate: [AuthGuardService]
            },

 
            {
                path: 'confcalendarios',
                loadChildren: './factoring/calendarios/calendarios.module#CalendariosModule',
                canActivate: [AuthGuardService]
            },



            
            {
                path: 'egp-requerimiento',
                loadChildren: './egp-requerimiento/requerimiento.module#RequerimientoModule',
                canActivate: [AuthGuardService]
            },
            {
                path: 'egp-cotizacion',
                loadChildren: './egp-cotizacion/cotizacion.module#CotizacionModule',
                canActivate: [AuthGuardService]
            },
            {
                path: 'egp-ordencompra',
                loadChildren: './egp-ordencompra/ordencompra.module#OrdenCompraModule',
                canActivate: [AuthGuardService]
            },
            {
                path: 'egp-calificacion',
                loadChildren: './egp-calificacion/calificacion.module#CalificacionModule',
                canActivate: [AuthGuardService]
            },


            {
                path: 'sm-requerimiento',
                loadChildren: './sm-requerimiento/requerimiento.module#RequerimientoModule',
                canActivate: [AuthGuardService]
            },
            {
                path: 'sm-cotizacion',
                loadChildren: './sm-cotizacion/cotizacion.module#CotizacionModule',
                canActivate: [AuthGuardService]
            },
            {
                path: 'sm-retencion',
                loadChildren: './sm-retencion/retencion.module#RetencionModule',
                canActivate: [AuthGuardService]
            },
            {
                path: 'sm-detraccion',
                loadChildren: './sm-detraccion/detraccion.module#DetraccionModule',
                canActivate: [AuthGuardService]
            },
            {
                path: 'sm-factura',
                loadChildren: './factura/sm-factura/factura.module#FacturaModule',
                canActivate: [AuthGuardService]
            },
            {
                path: 'sm-ordencompra',
                loadChildren: './sm-ordencompra/ordencompra.module#OrdenCompraModule',
                canActivate: [AuthGuardService]
            },
            {
                path: 'sm-guia',
                loadChildren: './sm-guia/guia.module#GuiaModule',
                canActivate: [AuthGuardService]
            },


            {
                path: 'transporte',
                loadChildren: './transporte/transporteservicio.module#TransporteServicioModule',
                canActivate: [AuthGuardService]
            },
            {
                path: 'cl-factura',
                loadChildren: './factura/cl-factura/factura.module#FacturaModule',
                canActivate: [AuthGuardService]
            },


            {
                path: 'organizacion',
                loadChildren: './administracion/organizacion/organizacion.module#OrganizacionModule',
                canActivate: [AuthGuardService]
            },
            {
                path: 'usuario',
                loadChildren: './administracion/usuario/usuario.module#UsuarioModule',
                canActivate: [AuthGuardService]
            },
            {
                path: 'modulo',
                loadChildren: './administracion/modulo/modulo.module#ModuloModule',
                canActivate: [AuthGuardService]
            },
            {
                path: 'accesoorganizacion',
                loadChildren: './administracion/accesoorganizacion/accesoorganizacion.module#AccesoOrganizacionModule',
                canActivate: [AuthGuardService]
            },
            {
                path: 'accesousuario',
                loadChildren: './administracion/accesousuario/accesousuario.module#AccesoUsuarioModule',
                canActivate: [AuthGuardService]
            },
            {
                path: 'grupoempresarial',
                loadChildren: './administracion/grupoempresarial/grupoempresarial.module#GrupoEmpresarialModule',
                canActivate: [AuthGuardService]
            },
            {
                path: 'contrato',
                loadChildren: './administracion/contratos/contratos.module#ContratosModule',
                canActivate: [AuthGuardService]
            },
            {
                path: 'aprobador',
                loadChildren: './administracion/aprobador/aprobador.module#AprobadorModule',
                canActivate: [AuthGuardService]
            },
            {
                path: 'indicadores',
                loadChildren: './indicadores/indicadores.module#IndicadoresModule',
                canActivate: [AuthGuardService]
            },

            {
                path: 'indicadores',
                loadChildren: './indicadores/indicadores.module#IndicadoresModule',
                canActivate: [AuthGuardService]
            },

            ...routesFacturacionElectronica.routes
        ]
    },
    {
        path: '',
        component: AuthLayoutComponent,
        children: [
            {
                path: '',
                loadChildren: './login/login.module#LoginModule'
            },
            {
                path: '',
                loadChildren: './cliente/cliente.module#ClienteModule'
            },
            {
                path: '',
                loadChildren: './administracion/recuperarpassword/recuperarpassword.module#RecuperarModule'
            },
        ]
    },
   /* {
        path: '',
        component: AuthLayoutComponent,
        children: [
            {
                path: '',
                loadChildren: './administracion/recuperarpassword/recuperarpassword.module#RecuperarModule'
            },
        ]
    }*/

    
];
