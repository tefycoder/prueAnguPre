import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {UtilsModule} from 'app/utils/utils.module';

import { OrganizacionAdminEbizBuscarComponent } from './adminebiz/buscar/organizacionadminebizbuscar.component';
import { OrganizacionAdminEbizFormularioComponent } from './adminebiz/formulario/organizacionadminebizformulario.component';
import { OrganizacionAdminEbizDetalleComponent } from './adminebiz/detalle/organizacionadminebizdetalle.component';

import { OrganizacionRoutes } from './organizacion.routing';

import {A2Edatetimepicker} from '../../directives/datepicker.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(OrganizacionRoutes),
        FormsModule,
        UtilsModule,
        A2Edatetimepicker
    ],
    declarations: [ 
        OrganizacionAdminEbizBuscarComponent,
        OrganizacionAdminEbizFormularioComponent,
        OrganizacionAdminEbizDetalleComponent
    ]
})

export class OrganizacionModule {}