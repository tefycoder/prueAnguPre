import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {UtilsModule} from 'app/utils/utils.module';

import { AccesoUsuarioAdminEbizBuscarComponent } from './adminebiz/buscar/accesousuarioadminebizbuscar.component';
import { AccesoUsuarioAdminEbizFormularioComponent } from './adminebiz/formulario/accesousuarioadminebizformulario.component';

import { AccesoUsuarioRoutes } from './accesousuario.routing';

import {A2Edatetimepicker} from '../../directives/datepicker.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(AccesoUsuarioRoutes),
        FormsModule,
        UtilsModule,
        A2Edatetimepicker
    ],
    declarations: [ AccesoUsuarioAdminEbizBuscarComponent,AccesoUsuarioAdminEbizFormularioComponent    
                                                                                        ]
})

export class AccesoUsuarioModule {}
