import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {UtilsModule} from 'app/utils/utils.module';

import { AccesoOrganizacionAdminEbizBuscarComponent } from './adminebiz/buscar/accesoorganizacionadminebizbuscar.component';
import { AccesoOrganizacionAdminEbizFormularioComponent } from './adminebiz/formulario/accesoorganizacionadminebizformulario.component';

import { AccesoOrganizacionRoutes } from './accesoorganizacion.routing';

import {A2Edatetimepicker} from '../../directives/datepicker.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(AccesoOrganizacionRoutes),
        FormsModule,
        UtilsModule,
        A2Edatetimepicker
    ],
    declarations: [ AccesoOrganizacionAdminEbizBuscarComponent,AccesoOrganizacionAdminEbizFormularioComponent    
                                                                                        ]
})

export class AccesoOrganizacionModule {}
