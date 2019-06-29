import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {UtilsModule} from 'app/utils/utils.module';

import { ContratosAdminEbizBuscarComponent } from './adminebiz/buscar/contratosadminebizbuscar.component';
import { ContratosAdminEbizFormularioComponent } from './adminebiz/formulario/contratosadminebizformulario.component';

import { ContratosRoutes } from './contratos.routing';

import {A2Edatetimepicker} from '../../directives/datepicker.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ContratosRoutes),
        FormsModule,
        UtilsModule,
        A2Edatetimepicker
    ],
    declarations: [ ContratosAdminEbizBuscarComponent,ContratosAdminEbizFormularioComponent    
                                                                                        ]
})

export class ContratosModule {}
