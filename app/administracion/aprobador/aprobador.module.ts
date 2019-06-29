import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UtilsModule } from 'app/utils/utils.module';

import { AprobadorAdminEbizBuscarComponent } from './adminebiz/buscar/aprobadoradminebizbuscar.component';

import { AprobadorRoutes } from './aprobador.routing';

import {A2Edatetimepicker} from '../../directives/datepicker.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(AprobadorRoutes),
        FormsModule,
        UtilsModule,
        A2Edatetimepicker
    ],
    declarations: [ 
        AprobadorAdminEbizBuscarComponent
    ]
})

export class AprobadorModule {}