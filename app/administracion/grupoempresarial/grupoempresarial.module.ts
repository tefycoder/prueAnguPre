import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UtilsModule } from 'app/utils/utils.module';

import { GrupoEmpresarialAdminEbizBuscarComponent } from './adminebiz/buscar/grupoempresarialadminebizbuscar.component';
import { GrupoEmpresarialAdminEbizFormularioComponent } from './adminebiz/formulario/grupoempresarialadminebizformulario.component';
import { GrupoEmpresarialAdminEbizDetalleComponent } from './adminebiz/detalle/grupoempresarialadminebizdetalle';

import { GrupoEmpresarialRoutes } from './grupoempresarial.routing';

import {A2Edatetimepicker} from '../../directives/datepicker.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(GrupoEmpresarialRoutes),
        FormsModule,
        UtilsModule,
        A2Edatetimepicker
    ],
    declarations: [ 
        GrupoEmpresarialAdminEbizBuscarComponent,
        GrupoEmpresarialAdminEbizFormularioComponent,
        GrupoEmpresarialAdminEbizDetalleComponent
    ]
})

export class GrupoEmpresarialModule {}