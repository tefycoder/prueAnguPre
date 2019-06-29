import { Routes } from '@angular/router';

import { RecuperarComponent } from './recuperarpassword.component';
import {NuevaContrasenaComponent} from './nuevacontrasena/nuevacontrasena.component';

export const RecuperarRoutes: Routes = [
  {

    path: '',
    children: [ 
      {
        path: 'recuperarpassword',
        component: RecuperarComponent
      },
      {
        path: 'nuevacontrasena',
        component: NuevaContrasenaComponent
      },
    ]
  }
];
