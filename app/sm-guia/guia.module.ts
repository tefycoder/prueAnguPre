import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UtilsModule } from '../utils/utils.module';

import { GuiaProveedorFormularioComponent } from 'app/sm-guia/proveedor/formulario/guiaproveedorformulario.component';
import { GuiaCompradorFormularioComponent } from 'app/sm-guia/comprador/formulario/guiacompradorformulario.component';
import { GuiaProveedorBuscarComponent } from './proveedor/buscar/guiaproveedorbuscar.component';
import { GuiaRoutes } from './guia.routing';


import {A2Edatetimepicker} from '../directives/datepicker.module';
import {GuiaCompradorBuscarComponent} from "app/sm-guia/comprador/buscar/guiacompradorbuscar.component";


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(GuiaRoutes),
        FormsModule,
        UtilsModule,A2Edatetimepicker
    ],
    declarations: [GuiaProveedorFormularioComponent, GuiaProveedorBuscarComponent, GuiaCompradorBuscarComponent, GuiaCompradorFormularioComponent]
})

export class GuiaModule {}
