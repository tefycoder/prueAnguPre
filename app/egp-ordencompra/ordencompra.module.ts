import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {UtilsModule} from '../utils/utils.module';

import { OrdenCompraCompradorBuscarComponent } from './comprador/buscar/ordencompracompradorbuscar.component';
import { OrdenCompraCompradorFormularioComponent } from './comprador/formulario/ordencompracompradorformulario.component';
import { OrdenCompraCompradorIngresoOCComponent } from './comprador/ingresooc/ordencompracompradoringresooc.component';

import { OrdenCompraProveedorBuscarComponent } from './proveedor/buscar/ordencompraproveedorbuscar.component';
import { OrdenCompraProveedorFormularioComponent} from './proveedor/formulario/ordencompraproveedorformulario.component';
import { OrdenCompraRoutes } from './ordencompra.routing';



import {A2Edatetimepicker} from '../directives/datepicker.module';
@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(OrdenCompraRoutes),
        FormsModule,
        UtilsModule,
        A2Edatetimepicker
    ],
    declarations: [OrdenCompraCompradorBuscarComponent,OrdenCompraProveedorBuscarComponent,
        OrdenCompraCompradorFormularioComponent,OrdenCompraProveedorFormularioComponent, OrdenCompraCompradorIngresoOCComponent]    
})

export class OrdenCompraModule {}
