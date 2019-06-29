import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RecuperarComponent} from './recuperarpassword.component';
import { RecuperarRoutes } from './recuperarpassword.routing';
import { NuevaContrasenaComponent } from './nuevacontrasena/nuevacontrasena.component';

import { BrowserModule } from '@angular/platform-browser';

@NgModule({

    imports: [
        CommonModule,
        RouterModule.forChild(RecuperarRoutes),
        FormsModule
    ],
    declarations: [RecuperarComponent, NuevaContrasenaComponent]
})

export class RecuperarModule {}