import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {UtilsModule} from 'app/utils/utils.module';

import { UsuarioAdminEbizBuscarComponent } from './adminebiz/buscar/usuarioadminebizbuscar.component';
import { UsuarioAdminEbizFormularioComponent } from './adminebiz/formulario/usuarioadminebizformulario.component';

import { UsuarioRoutes } from './usuario.routing';

import {A2Edatetimepicker} from '../../directives/datepicker.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(UsuarioRoutes),
        FormsModule,
        UtilsModule,
        A2Edatetimepicker
    ],
    declarations: [ UsuarioAdminEbizBuscarComponent,UsuarioAdminEbizFormularioComponent    
                                                                                        ]
})

export class UsuarioModule {}
