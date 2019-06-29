import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {UtilsModule} from 'app/utils/utils.module';

import { ModuloAdminEbizBuscarComponent } from './adminebiz/buscar/moduloadminebizbuscar.component';
import { ModuloAdminEbizFormularioComponent } from './adminebiz/formulario/moduloadminebizformulario.component';

import { ModuloRoutes } from './modulo.routing';

import {A2Edatetimepicker} from '../../directives/datepicker.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ModuloRoutes),
        FormsModule,
        UtilsModule,
        A2Edatetimepicker
    ],
    declarations: [ ModuloAdminEbizBuscarComponent,ModuloAdminEbizFormularioComponent    
                                                                                        ]
})

export class ModuloModule {}
